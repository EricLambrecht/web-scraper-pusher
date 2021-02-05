import { ElementHandle } from 'puppeteer'
import ListChangeScraper from './ListChangeScraper.js'

export default class ImmoScout24Scraper extends ListChangeScraper {
  name: string = 'ImmoScout24'
  startUrl =
    'https://www.immobilienscout24.de/Suche/de/hamburg/hamburg/wohnung-mieten?numberofrooms=2.5-5.0&price=400.0-1260.0&livingspace=60.0-150.0&pricetype=rentpermonth&geocodes=0200000004045,0200000004051,0200000001040,0200000005054,0200000004037,0200000006075,0200000007070,0200000006052,0200000006055,0200000001047,0200000006073,0200000005056,0200000005053,0200000004069,0200000004049,0200000006059,0200000007076,0200000001041,0200000006057,0200000004046,0200000005048,0200000001039,0200000004068,0200000006074,0200000006058&sorting=2'

  async scrapeForListElement() {
    await this.handleCookieBanner()
    const resultList = await this.page.$('ul#resultListItems')
    return resultList
  }

  async getListElements(list: ElementHandle) {
    return list.$$('li')
  }

  async retrieveComparisonValueFromListItem(listItem: ElementHandle) {
    return this.getExposeUrlFromListItem(listItem)
  }

  async inferDetailsFromListItem(listItem: ElementHandle) {
    return this.getExposeUrlFromListItem(listItem)
  }

  async getExposeUrlFromListItem(listItem: ElementHandle): Promise<string> {
    const exposeLink = await listItem.$('.result-list-entry__data a')
    const relativeLinkPath = await this.getElementAttribute(exposeLink, 'href')
    return 'https://www.immobilienscout24.de' + relativeLinkPath
  }

  async handleCookieBanner() {
    try {
      const cookieBanner = await this.page.waitForSelector('app-notice', {
        timeout: 5000,
      })
      if (cookieBanner) {
        const acceptButton = await this.page.$(
          'app-notice .action-buttons button:last-child'
        )
        await acceptButton.click()
      }
    } catch (e) {
      console.log(e)
    }
  }
}
