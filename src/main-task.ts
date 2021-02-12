import Puppeteer from 'puppeteer'
import Pusher from 'pusher'
import PushNotifications, {
  ApnsPayload,
} from '@pusher/push-notifications-server'
import { Client } from 'pg'
import ChangeScraper, {
  ChangeDetectionResult,
} from './scrapers/ChangeScraper.js'
import { DB_TABLE_CHANGE_SCRAPERS } from './config/db.js'
import ImmoweltScraper from './scrapers/ImmoweltScraper.js'
import ImmonetScraper from './scrapers/ImmonetScraper.js'
import IVD24Scraper from './scrapers/IVD24Scraper.js'
import WgGesuchtScraper from './scrapers/WgGesuchtScraper.js'

const SCRAPER_LIST: typeof ChangeScraper[] = [
  // ImmoScout24Scraper, // has bot protection!
  ImmoweltScraper,
  ImmonetScraper,
  IVD24Scraper,
  WgGesuchtScraper,
]

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
})

let beamsClient = new PushNotifications({
  instanceId: process.env.PUSHER_BEAM_INSTANCE_ID,
  secretKey: process.env.PUSHER_BEAM_SECRET_KEY,
})

const run = async (): Promise<void> => {
  sayHello()
  try {
    const dbClient = await initDatabase()
    await runChangeDetection(dbClient)
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

  let beamsClient = new PushNotifications({
    instanceId: 'YOUR_INSTANCE_ID_HERE',
    secretKey: 'YOUR_SECRET_KEY_HERE',
  })

  return pusher
}

const initDatabase = async (): Promise<Client> => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })
  await client.connect()
  await client.query(`CREATE TABLE IF NOT EXISTS ${DB_TABLE_CHANGE_SCRAPERS} (
    name varchar(45) NOT NULL,
    last_value varchar(8192) NOT NULL,
    enabled boolean NOT NULL DEFAULT 'true',
    PRIMARY KEY (name)
  );`)

  return client
}

const closeDatabase = async (client: Client): Promise<void> => client.end()

const runChangeDetection = async (client: Client): Promise<void> => {
  const browser = await Puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true, // TODO: make configurable via flag
  })

  const page = await browser.newPage()

  for (const Scraper of SCRAPER_LIST) {
    const scraper = new Scraper(page, client)
    console.log(`Running ${scraper.name}...`)
    const result = await scraper.detectChange()
    if (result.hasChanged) {
      publishNotification(result)
    }
  }

  await browser.close()
}

const publishNotification = async (result: ChangeDetectionResult) => {
  console.log('Sending new notification: ' + result.details)
  const title = result.scraper.name
  const body = result.details || 'no message'
  const url = result.url
  pusher.trigger('scraper_updates', 'change_detected', {
    headline: title,
    message: body,
  })
  console.log('url' + url)
  try {
    await beamsClient.publishToInterests(['private'], {
      apns: {
        aps: {
          alert: {
            title,
            body,
          },
          sound: 'chime.aiff',
        },
        data: {
          url,
        },
      } as ApnsPayload,
      fcm: {
        notification: {
          title,
          body,
        },
        data: {
          url,
        },
      },
      web: {
        notification: {
          title,
          body,
        },
        data: {
          url,
        },
      },
    })
    console.log('Pusher Beam has been sent')
  } catch (e) {
    console.log('Error publishing to interests (Pusher Beam)')
    console.log(e)
  }
}

//
// ====================================================
//

run()
