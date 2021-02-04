import { Client, Query } from 'pg'
import { Page } from 'puppeteer'
import { DB_TABLE_CHANGE_SCRAPERS } from '../config/db'

type ChangeDetectionResult = {
    hasChanged: boolean
    details?: string
}

type ChangeDetectionValue = string

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
        const newValue = await this.scrapeForValue()
        const oldValue = await this.getPreviousValue()
        const hasChanged = this.valueHasChanged(newValue, oldValue)
        const details = this.getDetails()

        await this.persistValue(newValue)

        return {
            hasChanged,
            details,
        }
    }

    /**
     * Retrieves a new change detection value from a webpage
     */
    async scrapeForValue(): Promise<ChangeDetectionValue> {
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
            values: [this.name, data]
        }
        try {
            const res = await this.db.query(query)
        } catch (e) {
            console.error(e.stack)
        }
    }

    /**
     * Returns true if values differ
     * @param newValue old value
     * @param oldValue new value
     */
    valueHasChanged(newValue: ChangeDetectionValue, oldValue: ChangeDetectionValue): boolean {
        console.log(newValue, oldValue)
        return newValue !== oldValue
    }

    getDetails(): string {
        return this.details
    }
}