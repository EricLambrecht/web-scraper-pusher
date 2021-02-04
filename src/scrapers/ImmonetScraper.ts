import ChangeScraper from './ChangeScraper.js'

export default class ImmonetScraper extends ChangeScraper {
    name: string = "Immonet"
    startUrl = "https://immonet.de"
}