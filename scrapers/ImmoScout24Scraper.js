import Scraper from './Scraper.js'

export default class ImmoScout24Scraper extends Scraper {
    name = "ImmoScout24"
    scrape() {
        console.log('ImmoScout24 scrape!' + this.name)
    }
}