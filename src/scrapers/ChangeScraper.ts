import { Client } from 'pg'
import { Page } from 'puppeteer'

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
    name: string = "_ChangeScraperClass"

    constructor(page: Page, client: Client) {
        this.page = page
        this.db = client
    }

    async detectChange(): Promise<ChangeDetectionResult> {
        await this.page.goto(this.startUrl)
        const newValue = this.scrapeForValue()
        const oldValue = this.getPreviousValue()
        const hasChanged = this.valueHasChanged(newValue, oldValue)
        const details = this.getDetails()

        this.persistValue(newValue)

        return {
            hasChanged,
            details,
        }
    }

    /**
     * Retrieves a new change detection value from a webpage
     */
    scrapeForValue(): ChangeDetectionValue {
        return ''
    }

    /**
     * Retrieves the persisted change detection value from the DB
     */
    getPreviousValue(): ChangeDetectionValue {
        // TODO: use postgress client to get value
        return ''
    }

    /**
     * Stores the change detection value in the DB
     * @param data Will be stored in DB
     */
    persistValue(data: ChangeDetectionValue) {
        // TODO: use postgress client to save value
    }

    /**
     * Returns true if values differ
     * @param newValue old value
     * @param oldValue new value
     */
    valueHasChanged(newValue: ChangeDetectionValue, oldValue: ChangeDetectionValue): boolean {
        return newValue !== oldValue
    }

    getDetails(): string {
        return this.details
    }
}