import { ElementHandle } from 'puppeteer'
import ChangeScraper, { ChangeDetectionValue } from './ChangeScraper.js'

export default class ListChangeScraper extends ChangeScraper {
  listElements: ElementHandle[]
  comparisonValueToListItemMap: {
    [key: string]: ElementHandle
  } = {}

  async scrapeForElement() {
    return this.scrapeForListElement()
  }

  async scrapeForListElement(): Promise<ElementHandle> {
    throw new Error(
      this.name +
        ': ListChange scrapers must implement the scrapeForListElement function.'
    )
  }

  async onScrapingFinished(scrapedList: ElementHandle) {
    this.listElements = await this.getListItemElements(scrapedList)
    const comparisonValueArray = await Promise.all(
      this.listElements.map((el) =>
        this.retrieveComparisonValueFromListItem(el)
      )
    )
    comparisonValueArray.forEach((value, index) => {
      this.comparisonValueToListItemMap[value] = this.listElements[index]
    })
  }

  async retrieveComparisonValueFromScrapedElement(list: ElementHandle) {
    if (this.listElements.length === 0) {
      return ''
    }
    return Object.keys(this.comparisonValueToListItemMap).join(',')
  }

  async getListItemElements(list: ElementHandle): Promise<ElementHandle[]> {
    throw new Error(
      this.name +
        ': ListChange scrapers must implement the getListItemElements function.'
    )
  }

  async retrieveComparisonValueFromListItem(
    listItem: ElementHandle
  ): Promise<string> {
    throw new Error(
      this.name +
        ': ListChange scrapers must implement the retrieveComparisonValueFromListItem function.'
    )
  }

  async inferDetailsFromDelta(delta: ElementHandle[]) {
    const deltaToDetailMap = await Promise.all(
      delta.map((el) => this.inferDetailsFromListItem(el))
    )
    return `${
      deltaToDetailMap.length
    } neue(s) Ergebnis(se): ${deltaToDetailMap.join(', ')}`
  }

  async inferDetailsFromListItem(listItem: ElementHandle) {
    console.warn('inferDetailsFromListItem() was not implemented.')
    return ''
  }

  async getDelta(
    newValue: ChangeDetectionValue,
    lastValue: ChangeDetectionValue,
    scrapedList: ElementHandle
  ): Promise<ElementHandle[]> {
    if (newValue === lastValue) {
      return []
    }
    const newValueArray = newValue.split(',')
    const lastValueArray = lastValue.split(',')

    const deltaValues = newValueArray.filter(
      (value) => !lastValueArray.includes(value)
    )
    return deltaValues.map((value) => this.comparisonValueToListItemMap[value])
  }
}
