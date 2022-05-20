import puppeteer from "puppeteer/lib/esm/puppeteer/node-puppeteer-core.js";

class PuppeteerAPI {

    constructor(url) {
        this.url = url
        this.browser = null
        this.config = {headless: false}
    }

    async newBrowser() {
        return await puppeteer.launch(this.config)
    }

    async getBrowser() {

        if (!this.browser) {
            this.browser = await this.newBrowser()
        }

        return this.browser
    }

    async newPage() {
        const browser = await this.getBrowser()
        const page = await browser.newPage()
        return page
    }


}

export default PuppeteerAPI;