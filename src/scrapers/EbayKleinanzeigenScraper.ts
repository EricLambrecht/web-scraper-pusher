import { ElementHandle } from 'puppeteer'
import ListChangeScraper from './ListChangeScraper.js'

export default class EbayKleinanzeigenScraper extends ListChangeScraper {
  name: string = 'ebay Kleinanzeigen'
  startUrl =
    'https://www.ebay-kleinanzeigen.de/s-wohnung-mieten/hamburg/anzeige:angebote/preis::1250/c203l9409r6+wohnung_mieten.qm_d:65.00,+wohnung_mieten.zimmer_d:2.5,5.0'
  async scrapeForListElement() {
    return this.page.$('#srchrslt-adtable')
  }

  async getListItemElements(list: ElementHandle) {
    return list.$$('article.aditem')
  }

  async retrieveComparisonValueFromListItem(listItem: ElementHandle) {
    return this.getExposeUrlFromListItem(listItem)
  }

  async inferDetailsFromListItem(listItem: ElementHandle) {
    return this.getExposeUrlFromListItem(listItem)
  }

  async inferUrlFromDelta(items: ElementHandle[]) {
    if (items.length < 1) {
      return null
    }
    return this.getExposeUrlFromListItem(items[0])
  }

  async getExposeUrlFromListItem(listItem: ElementHandle): Promise<string> {
    const exposeLink = await listItem.$('a.ellipsis')
    const relativeLinkPath = await this.getElementAttribute(exposeLink, 'href')
    return 'https://www.ebay-kleinanzeigen.de' + relativeLinkPath
  }
}
