import scraperList from './scrapers/index.js'
import Puppeteer from 'puppeteer'

const run = async (): Promise<void> => {
  sayHello()
  await runScrapers()
  sayGoodbye()
}

const sayHello = (): void => {
  console.log('>>> Starting Web-Scraper! <<<')
}

const sayGoodbye = (): void => {
  console.log('>>> Scraping finished! <<<')
}

const runScrapers = async (): Promise<void> => {
  const browser = await Puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    headless: true // TODO: make configurable via flag
  });
  const page = await browser.newPage();

  for (const Scraper of scraperList) {
    const scraper = new Scraper(page)
    console.log(`Running ${scraper.name}...`)
    await scraper.scrape()
  }

  await browser.close();
}

//
// ====================================================
//

await run()