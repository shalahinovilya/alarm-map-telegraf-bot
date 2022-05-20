import {Telegraf} from "telegraf";
import 'dotenv/config'
import MapController from "./controllers/MapController.js";
import AlarmController from "./controllers/AlarmController.js";

let lastAlarmTime = 0
let lastMapTime = 0
const TOKEN = process.env.TOKEN

const bot = new Telegraf(TOKEN);


bot.command('map', async (ctx) => {

    setTimeout(async () => {

        const chatId = ctx.chat.id
        const currMapTime = new Date()

        if ( (currMapTime.getTime() - lastMapTime) < 4000) {
            await ctx.tg.sendMessage(ctx.chat.id, 'Не так часто!')
            return 1
        }

        lastMapTime = new Date().getTime()

        try {

            const awaitMessage = await ctx.telegram.sendMessage(chatId, 'Завантажую карту повітряних тривог...')

            await MapController.getScreen()

            await ctx.tg.deleteMessage(chatId, awaitMessage.message_id)
            await ctx.replyWithPhoto( {source: 'map.jpg'})

        } catch (e) {
            console.log(e)
        }
    })

})



bot.command('alarm', async (ctx) => {

    setTimeout(async () => {

        const chatId = ctx.chat.id
        const currAlarmTime = new Date()


        if ( (currAlarmTime.getTime() - lastAlarmTime) < 3000) {
            await ctx.tg.sendMessage(ctx.chat.id, 'Не так часто!')
            return 1
        }

        lastAlarmTime = new Date().getTime()

        let alarmInfo = ''

        try {

            const awaitMessage = await ctx.tg.sendMessage(chatId, 'Завантажую перелік активних повітряних тривог...')

            const alarms = await AlarmController.getAlarmList()

            for (let alarmNum = 0; alarmNum< alarms.length; alarmNum++) {

                const currentAlarm = alarms[alarmNum]

                for (let dataNum = 0; dataNum < currentAlarm.length; dataNum++) {

                    alarmInfo +=
                        (dataNum === 0) ? `<b>${currentAlarm[dataNum]};</b>   ` :
                            (dataNum === 1) ? `<b>📅${currentAlarm[dataNum]};</b>   ` :
                                `<b>⏳${currentAlarm[dataNum]};</b>   `

                }
                alarmInfo += `\n\n`
            }

            alarmInfo += `<b>Усьго активних тривог: ${alarms.length - 1}</b>`

            await ctx.tg.deleteMessage(chatId, awaitMessage.message_id)

            await ctx.replyWithHTML(alarmInfo)

        } catch (e) {

            await ctx.tg.sendMessage(chatId, 'Виникла помилка, спробуйте ще раз')
            console.log(e)
        }

    })


})


bot.launch()