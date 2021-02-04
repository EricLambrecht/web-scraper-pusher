import Puppeteer from 'puppeteer'
import { Client } from 'pg'
import ChangeScraper from './scrapers/ChangeScraper.js'
import ImmoScout24Scraper from './scrapers/ImmoScout24Scraper.js'
import ImmoweltScraper from './scrapers/ImmoweltScraper.js'
import ImmonetScraper from './scrapers/ImmonetScraper.js'

const SCRAPER_LIST: typeof ChangeScraper[] = [
    ImmoScout24Scraper,
    ImmoweltScraper,
    ImmonetScraper,
]

const run = async (): Promise<void> => {
  sayHello()
  try {
    const dbClient = await initDatabase()
    await runChangeDetection(dbClient)
    closeDatabase(dbClient)
  }
  catch (e) {
    console.log(e)
  }
  sayGoodbye()
}

const sayHello = (): void => {
  console.log('>>> Starting Web-Scraper! <<<')
}

const sayGoodbye = (): void => {
  console.log('>>> Scraping finished! <<<')
}

const initDatabase = async (): Promise<Client> => {
  console.log('connecting to', process.env.DATABASE_URL)
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  await client.connect()
  return client
}

const closeDatabase = async (client: Client): Promise<void> => client.end()

const runChangeDetection = async (client: Client): Promise<void> => {
  const browser = await Puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    headless: true // TODO: make configurable via flag
  });

  const page = await browser.newPage();

  for (const Scraper of SCRAPER_LIST) {
    const scraper = new Scraper(page, client)
    console.log(`Running ${scraper.name}...`)
    const result = await scraper.detectChange()
    publishNotification(result.details)
  }

  await browser.close();
}

const publishNotification = (notification: string) => {
  console.log('Notification: ' + notification)
}

//
// ====================================================
//

run()