/** Modules */
import { Client } from 'discord.js'

import { commands } from '../../helpers'

function login() {
  const bot = new Client()
  bot.login(process.env.DISCORD_BOT_TOKEN)
  return bot
}

export function listener() {
  const bot = login()
  bot.on('message', async (msg) => {
    if (msg.channel.type !== 'text') return
    const prefix = process.env.DISCORD_BOT_PREFIX ?? '>'
    if (!msg.content.startsWith(prefix)) return
    const [cmd, ...args] = msg.content.substring(prefix.length).toLowerCase().trim().split(' ')
    const response = await commands(cmd, args)
    msg.channel.send(response)
  })
}