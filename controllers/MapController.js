import 'dotenv/config'
import PuppeteerAPI from "../api/PuppeteerAPI.js";

class MapController extends PuppeteerAPI{

    constructor(url) {
        super(url)

        this.viewportConfig = {
            width: 1080,
            height: 790,
            deviceScaleFactor: 1
        }

        this.screenConfig = {
            path: 'map.jpg',
            clip: {
                x: 0,
                y: 0,
                width: 1080,
                height: 760
            }
        }
    }


    async prepareHtmlBeforeScreen(page) {

        await page.waitForSelector('path')
        await page.evaluate(async () => {
            try {
                const html = await document.querySelector('.light')
                html.className = "loaded"

                await document.querySelector('.expander').remove()

                const sub = await document.querySelector('.map-header')
                await sub.childNodes[4].remove()

                await document.querySelector('.tab-nav-container').remove()

                const mapHeader = await document.querySelector('.map-header')
                mapHeader.style.left = "60px"

                const mobileHidden = await document.querySelector('.mobile-hidden')
                mobileHidden.style.right = "40px"
                mobileHidden.style.bottom = "40px"
            } catch (e) {
                console.log(e)
            }
        })

    }

    async getScreen() {

        const page = await super.newPage();

        await page.setViewport(this.viewportConfig);

        await page.goto(this.url, { waitUntil: 'networkidle2' })

        await this.prepareHtmlBeforeScreen(page)

        await page.screenshot(this.screenConfig);

        await page.close()

    }

}

export default new MapController(process.env.URL)
