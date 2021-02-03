import scraperList from './scrapers/index'

const run = (): void => {
  sayHello()
  runScrapers()
  sayGoodbye()
}

const sayHello = (): void => {
  console.log('>>> Starting Web-Scraper! <<<')
}

const sayGoodbye = (): void => {
  console.log('>>> Scraping finished! <<<')
}

const runScrapers = (): void => {
  scraperList.forEach((Scraper) => {
    const scraper = new Scraper()
    console.log(`Running ${scraper.name}...`)
    scraper.scrape()
  })
}

//
// ====================================================
//

run()