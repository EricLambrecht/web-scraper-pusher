import ChangeScraper from './ChangeScraper.js'

export default class ImmoScout24Scraper extends ChangeScraper {
    name: string = "ImmoScout24"
    startUrl = 'https://www.immobilienscout24.de/'

    async scrapeForValue() {
        const element = await this.page.$('[data-qa=title] > span')
        return element.toString()
    }
}