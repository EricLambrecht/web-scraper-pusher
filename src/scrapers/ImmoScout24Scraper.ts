import ChangeScraper from './ChangeScraper.js'

export default class ImmoScout24Scraper extends ChangeScraper {
    name: string = "ImmoScout24"
    startUrl = 'https://www.immobilienscout24.de/'

    async scrapeValue() {
        const element = await this.page.$('[data-qa=title] > span')
        return element
    }

    // TODO: pusher channels server installeiren, notify function o.ä. hinzufügen
    // eventuell abstrahieren zu change scraper? aber vllt auch nciht... 
    // db zugriff? um changes zu merken? 
}