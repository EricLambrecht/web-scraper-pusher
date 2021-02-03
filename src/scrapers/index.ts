import Scraper from './Scraper'
import ImmoScout24Scraper from './ImmoScout24Scraper'
import ImmoweltScraper from './ImmoweltScraper'

const list: typeof Scraper[] = [ImmoScout24Scraper, ImmoweltScraper]
export default list