import { Client, Query } from 'pg'
import { ElementHandle, Page } from 'puppeteer'
import { DB_TABLE_CHANGE_SCRAPERS } from '../config/db'

export type ChangeDetectionResult = {
  hasChanged: boolean
  details?: string
}

export type ChangeDetectionValue = string

export default class ChangeScraper {
  page: Page
  db: Client
  details: string
  startUrl: string
  name: string = '_ChangeScraperClass'

  constructor(page: Page, client: Client) {
    this.page = page
    this.db = client
  }

  async detectChange(): Promise<ChangeDetectionResult> {
    if (this.name === '_ChangeScraperClass') {
      throw new Error('Please specify a name for this scraper')
    }

    await this.page.goto(this.startUrl)
    const scrapedElement = await this.scrapeForElement()
    const previousValue = await this.getPreviousValue()

    const delta = await this.getDelta(scrapedElement, previousValue)
    const details = await this.inferDetailsFromDelta(delta)

    const newValue = await this.retrieveComparisonValueFromScrapedElement(
      scrapedElement
    )
    await this.persistValue(newValue)

    return {
      hasChanged: delta.length !== 0,
      details,
    }
  }

  /**
   * Retrieves a new change detection value from a webpage
   */
  async scrapeForElement(): Promise<ElementHandle> {
    throw new Error(`${this.name} is missing the scrapeForValue() function!`)
  }

  /**
   * Retrieves the persisted change detection value from the DB
   */
  async getPreviousValue(): Promise<ChangeDetectionValue> {
    const query = {
      // give the query a unique name
      name: `fetch-last-value-${this.name}`,
      text: `SELECT * FROM ${DB_TABLE_CHANGE_SCRAPERS} WHERE name = $1`,
      values: [this.name],
    }
    try {
      const res = await this.db.query(query)
      return res.rows[0]?.last_value || ''
    } catch (e) {
      console.error(e.stack)
    }
    return ''
  }

  /**
   * Stores the change detection value in the DB
   * @param data Will be stored in DB
   */
  async persistValue(data: ChangeDetectionValue) {
    const query = {
      name: `save-last-value-${this.name}`,
      text: `INSERT INTO ${DB_TABLE_CHANGE_SCRAPERS}(name, last_value) 
            VALUES($1, $2) 
            ON CONFLICT (name)
            DO UPDATE SET last_value = $2;`,
      values: [this.name, data],
    }
    try {
      await this.db.query(query)
    } catch (e) {
      console.error(e.stack)
    }
  }

  /**
   * Returns a list of changes compared to the previous scraping session. An empty array means nothing has changed.
   * The list can contain one or more items depending on what has changed and what is supposed to be done with the delta.
   * @param scrapedElement The currently scraped element
   * @param lastValue
   */
  async getDelta(
    scrapedElement: ElementHandle,
    lastValue: ChangeDetectionValue
  ): Promise<ElementHandle[]> {
    return []
  }

  async getElementTextContent(element: ElementHandle): Promise<string | null> {
    if (!element) return null
    return this.page.evaluate((el) => el.textContent, element)
  }

  async getElementAttribute(
    element: ElementHandle,
    attributeName: string
  ): Promise<string | null> {
    if (!element) return null
    return this.page.evaluate(
      (el: HTMLElement, attributeName: string) =>
        el.getAttribute(attributeName),
      element,
      attributeName
    )
  }

  async retrieveComparisonValueFromScrapedElement(
    element: ElementHandle
  ): Promise<string> {
    return this.getElementTextContent(element)
  }

  async inferDetailsFromDelta(delta: ElementHandle[]): Promise<string> {
    return ''
  }
}
