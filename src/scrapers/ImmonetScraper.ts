import { ElementHandle } from 'puppeteer'
import ListChangeScraper from './ListChangeScraper.js'

export default class ImmonetScraper extends ListChangeScraper {
  name: string = 'Immonet'
  startUrl =
    'https://www.immonet.de/immobiliensuche/sel.do?&marketingtype=2&fromarea=55.0&toprice=1300.0&city=109447&objectrights=1&fromrooms=2.5&district=9542&district=9564&district=9543&district=9565&district=9563&district=9524&district=9601&district=9623&district=9525&district=72732&district=9566&district=9588&district=9545&district=9560&district=9539&district=9615&district=9619&district=9554&district=9573&district=9595&district=7254&district=9535&district=9558&district=9555&district=9528&district=9527&district=9607&district=9608&parentcat=1&sortby=19&suchart=1&objecttype=1&outputtype=ajax&searchall=26l16i5296665504'

  async scrapeForListElement() {
    const resultList = await this.page.$('#idResultList')
    return resultList
  }

  async getListItems(list: ElementHandle) {
    console.log((await list.$$('div.item')).length)
    return list.$$('div.item')
  }

  async retrieveComparisonValueFromListItem(listItem: ElementHandle) {
    return this.getExposeUrlFromListItem(listItem)
  }

  async inferDetailsFromListItem(listItem: ElementHandle) {
    return this.getExposeUrlFromListItem(listItem)
  }

  async getExposeUrlFromListItem(listItem: ElementHandle): Promise<string> {
    const exposeLink = await listItem.$('a[id^=lnkImgToDetails]')
    const relativeLinkPath = await this.getElementAttribute(exposeLink, 'href')
    return 'https://www.immonet.de' + relativeLinkPath
  }
}
