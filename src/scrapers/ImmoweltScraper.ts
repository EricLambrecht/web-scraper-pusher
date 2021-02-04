import ChangeScraper from './ChangeScraper.js'

export default class ImmoweltScraper extends ChangeScraper {
    name: string = "Immowelt"
    startUrl = "https://immowelt.de"
}