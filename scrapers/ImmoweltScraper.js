import Scraper from './Scraper.js'

export default class ImmoweltScraper extends Scraper {
    name = "Immowelt"
    scrape() {
        console.log('Immowelt scrape!' + this.name)
    }
}