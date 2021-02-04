import Scraper from './Scraper.js'
import ImmoScout24Scraper from './ImmoScout24Scraper.js'
import ImmoweltScraper from './ImmoweltScraper.js'
import ImmonetScraper from './ImmonetScraper.js'

const list: typeof Scraper[] = [
    ImmoScout24Scraper,
    ImmoweltScraper,
    ImmonetScraper,
]
export default list