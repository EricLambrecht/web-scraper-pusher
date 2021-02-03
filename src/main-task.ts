import scraperList from './scrapers/index.js'

function run() {
  greet()
  runScrapers()
}

const greet = () => {
  console.log('Starting Web-Scraper!')
}

const runScrapers = () => {
  scraperList.forEach((Scraper) => {
    const scraper = new Scraper()
    scraper.scrape()
  })
}

//
// ====================================================
//

run()