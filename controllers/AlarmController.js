import 'dotenv/config'
import PuppeteerAPI from "../api/PuppeteerAPI.js";

class AlarmController extends PuppeteerAPI{

    constructor(url) {
        super(url)
        this.config = { headless: false}
    }

    async getAlarmsFromPage(page) {

        try {
            await page.waitForSelector('path')
            const list = await page.evaluate(async () => {

                const alertList = []

                const alerts = await document
                        .querySelector('.screen.list')
                        .querySelector('.responsive-table').children

                for (let alert = 0; alert < alerts.length; alert++) {

                    const data = []
                    const li = await alerts[alert].children

                    for (let alertData = 0; alertData < li.length; alertData++) {

                        data.push(li[alertData].textContent)

                    }
                    alertList.push(data)
                }
                return alertList

            })

            return list

        } catch (e) {
            console.log(e)
        }

    }

    async getAlarmList() {

        const page = await super.newPage();

        await page.goto(this.url, { waitUntil: 'networkidle2' })

        await page.waitForTimeout(3000)

        const alertsList = await this.getAlarmsFromPage(page)
        await page.close()

        return alertsList

    }

}

export default new AlarmController(process.env.URL);

