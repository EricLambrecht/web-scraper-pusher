import { ElementHandle } from 'puppeteer'
import ListChangeScraper from './ListChangeScraper.js'

export default class IVD24Scraper extends ListChangeScraper {
  name: string = 'IVD 24 Immobilien'
  startUrl =
    'https://www.ivd24immobilien.de/search-photon/?osm_id=20833623&osm_key=place&osm_value=city&osm_postcode=20095&osm_lat=53.550341&osm_long=10.000654&nutzungsart_id=&vermarktungsart_id=10000000010&601d630ae62d7=Hamburg&search_term=Hamburg&objektart_id=2&anzahl_zimmer=&preis_bis=1300&groesse_ab=70&radius=0'

  async scrapeForListElement() {
    // wait for page to finish loading...
    await this.page.waitForSelector('img.spinneridoo', { hidden: true })
    const resultList = await this.page.$('.data-container') // risky, but there is only one right now
    return resultList
  }

  async getListItems(list: ElementHandle) {
    return list.$$('.rr-list-results')
  }

  async retrieveComparisonValueFromListItem(listItem: ElementHandle) {
    return this.getExposeUrlFromListItem(listItem)
  }

  async inferDetailsFromListItem(listItem: ElementHandle) {
    return this.getExposeUrlFromListItem(listItem)
  }

  async getExposeUrlFromListItem(listItem: ElementHandle): Promise<string> {
    const exposeLink = await listItem.$('.expose-button a')
    const relativeLinkPath = await this.getElementAttribute(exposeLink, 'href')
    return 'https://www.ivd24immobilien.de' + relativeLinkPath
  }
}
