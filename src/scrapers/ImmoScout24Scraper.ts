import Scraper from './Scraper.js'

export default class ImmoScout24Scraper extends Scraper {
    name: string = "ImmoScout24"

    async scrape() {
        await this.page.goto('https://www.immobilienscout24.de/');
        const element = await this.page.$('[data-qa=title] > span')
        console.log(element ? 'element found!' : 'element not found')
    }

    // TODO: pusher channels server installeiren, notify function o.ä. hinzufügen
    // eventuell abstrahieren zu change scraper? aber vllt auch nciht... 
    // db zugriff? um changes zu merken? 
}