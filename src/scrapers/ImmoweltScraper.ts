import { ElementHandle } from 'puppeteer'
import ListChangeScraper from './ListChangeScraper.js'

export default class ImmoweltScraper extends ListChangeScraper {
  name: string = 'Immowelt'
  startUrl =
    'https://www.immowelt.de/liste/suchauftragsergebnisse/ca7cf7c23fa64ea686897bd03b26b169'

  async scrapeForListElement() {
    return this.page.$('.immoliste')
  }

  async getListElements(list: ElementHandle) {
    return list.$$('.listitem')
  }

  async retrieveComparisonValueFromListItem(listItem: ElementHandle) {
    return this.getExposeUrlFromListItem(listItem)
  }

  async inferDetailsFromListItem(listItem: ElementHandle) {
    return this.getExposeUrlFromListItem(listItem)
  }

  async getExposeUrlFromListItem(listItem: ElementHandle): Promise<string> {
    const exposeLink = await listItem.$('* > a')
    const relativeLinkPath = await this.getElementAttribute(exposeLink, 'href')
    return 'https://www.immowelt.de' + relativeLinkPath
  }
}
