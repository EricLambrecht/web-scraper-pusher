import Scraper from './Scraper'
import ImmoScout24Scraper from './ImmoScout24Scraper'
import ImmoweltScraper from './ImmoweltScraper'
import ImmonetScraper from './ImmonetScraper'

const list: typeof Scraper[] = [
    ImmoScout24Scraper,
    ImmoweltScraper,
    ImmonetScraper,
]
export default list