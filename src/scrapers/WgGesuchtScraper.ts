import { ElementHandle } from 'puppeteer'
import ListChangeScraper from './ListChangeScraper.js'

export default class WgGesuchtScraper extends ListChangeScraper {
  name: string = 'WG Gesucht'
  startUrl =
    'https://www.wg-gesucht.de/wohnungen-in-Hamburg.55.2.1.0.html?user_filter_id=1956535&offer_filter=1&noDeact=1&city_id=55&category=2&rent_type=2&sMin=60&rMax=1450&rmMin=3&ot=1189%2C1190%2C1192%2C1193%2C1200%2C1204%2C1207%2C1208%2C1210%2C85010%2C85011%2C1221%2C1219%2C1224%2C1227%2C1228%2C1229%2C1236%2C1251%2C1258%2C1265%2C1272%2C1271%2C85021%2C1279%2C1283%2C1287&categories%5B0%5D=2&rent_types%5B0%5D=2'

  async scrapeForListElement() {
    return this.page.$('#main_column')
  }

  async getListItemElements(list: ElementHandle) {
    return list.$$('.wgg_card.offer_list_item ')
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
    const exposeLink = await listItem.$('.card_image a')
    const relativeLinkPath = await this.getElementAttribute(exposeLink, 'href')
    return 'https://www.wg-gesucht.de/' + relativeLinkPath
  }
}
