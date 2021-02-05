import Puppeteer from 'puppeteer'
import Pusher from 'pusher'
import { Client } from 'pg'
import ChangeScraper, {
  ChangeDetectionResult,
} from './scrapers/ChangeScraper.js'
import ImmoweltScraper from './scrapers/ImmoweltScraper.js'
import ImmonetScraper from './scrapers/ImmonetScraper.js'
import { DB_TABLE_CHANGE_SCRAPERS } from './config/db.js'
import IVD24Scraper from './scrapers/IVD24Scraper.js'

const SCRAPER_LIST: typeof ChangeScraper[] = [
  // ImmoScout24Scraper, // has bot protection!
  // ImmoweltScraper,
  // ImmonetScraper,
  IVD24Scraper,
]

const run = async (): Promise<void> => {
  sayHello()
  try {
    const dbClient = await initDatabase()
    const pusher = initPusher()
    await runChangeDetection(dbClient, pusher)
    closeDatabase(dbClient)
  } catch (e) {
    console.log(e)
  }
  sayGoodbye()
}

const sayHello = (): void => {
  console.log('>>> Starting Web-Scraper! <<<')
}

const sayGoodbye = (): void => {
  console.log('>>> Scraping finished! <<<')
  process.exit()
}

const initPusher = (): Pusher => {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  })

  return pusher
}

const initDatabase = async (): Promise<Client> => {
  console.log('connecting to', process.env.DATABASE_URL)
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
  await client.connect()
  await client.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_CHANGE_SCRAPERS} (
    name varchar(45) NOT NULL,
    last_value varchar(450) NOT NULL,
    enabled boolean NOT NULL DEFAULT 'true',
    PRIMARY KEY (name)
  );`)
  return client
}

const closeDatabase = async (client: Client): Promise<void> => client.end()

const runChangeDetection = async (
  client: Client,
  pusher: Pusher
): Promise<void> => {
  const browser = await Puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: false, // TODO: make configurable via flag
  })

  const page = await browser.newPage()

  for (const Scraper of SCRAPER_LIST) {
    const scraper = new Scraper(page, client)
    console.log(`Running ${scraper.name}...`)
    const result = await scraper.detectChange()
    if (result.hasChanged) {
      publishNotification(pusher, result)
    }
  }

  await browser.close()
}

const publishNotification = (pusher: Pusher, result: ChangeDetectionResult) => {
  console.log('Notification: ' + result.details)
  pusher.trigger('scraper_updates', 'change_detected', {
    id: result.id,
    message: result.details,
  })
}

//
// ====================================================
//

run()
