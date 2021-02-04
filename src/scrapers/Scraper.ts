import Puppeteer from 'puppeteer'

export default class Scraper {
    page: Puppeteer.Page
    name: string = "Abstract Scraper"
    constructor(page: Puppeteer.Page) {
        this.page = page
    }
    async scrape(): Promise<void> {
        console.log('scrape func not implemented')
    }
}