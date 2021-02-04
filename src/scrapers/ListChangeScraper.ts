import { ElementHandle } from 'puppeteer'
import ChangeScraper, { ChangeDetectionValue } from './ChangeScraper.js'

export default class ListChangeScraper extends ChangeScraper {
    async scrapeForElement() {
        return this.scrapeForListElement()
    }

    async scrapeForListElement(): Promise<ElementHandle> {
        throw new Error(this.name + ': ListChange scrapers must implement the scrapeForListElement function.')
    }

    async retrieveComparisonValueFromScrapedElement(list: ElementHandle) {
        const items = await this.getListItems(list)
        if (items.length === 0) {
            return ''
        }
        const firstItem = items[0]
        return this.retrieveComparisonValueFromListItem(firstItem)
    }

    async getListItems(list: ElementHandle): Promise<ElementHandle[]> {
        throw new Error(this.name + ': ListChange scrapers must implement the getListItems function.')
    }

    async retrieveComparisonValueFromListItem(listItem: ElementHandle): Promise<string> {
        throw new Error(this.name + ': ListChange scrapers must implement the retrieveComparisonValueFromListItem function.')
    }

    async inferDetailsFromDelta(delta: ElementHandle[]) {
        const detailMap = await Promise.all(delta.map(el => this.inferDetailsFromListItem(el)))
        return `${detailMap.length} neue(s) Ergebnis(se): ${detailMap.join(', ')}`
    }

    async inferDetailsFromListItem(listItem: ElementHandle) {
        console.warn('inferDetailsFromListItem() was not implemented.')
        return ''
    }

    async getDelta(scrapedList: ElementHandle, lastValue: ChangeDetectionValue): Promise<ElementHandle[]> {
        const listElements = await this.getListItems(scrapedList)
        const listElementsMappedToValue = await Promise.all(listElements.map(el => this.retrieveComparisonValueFromListItem(el)))
        const indexOfLastValue = listElementsMappedToValue.findIndex(val => val === lastValue)
        return listElements.slice(0, indexOfLastValue)
    }
}