import Scraper from './Scraper'

export default class ImmoScout24Scraper extends Scraper {
    name: string = "ImmoScout24"
    scrape(): void {
        console.log('ImmoScout24 scrape!' + this.name)
    }
}