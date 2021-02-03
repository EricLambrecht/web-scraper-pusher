import Scraper from './Scraper.js'

export default class ImmoweltScraper extends Scraper {
    name: string = "Immowelt"
    scrape(): void {
        console.log('Immowelt scrape!' + this.name)
    }
}