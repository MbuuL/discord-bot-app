/** Modules */
import { MessageEmbed } from 'discord.js'

import { calculate } from '../controllers/crypto'

const commandList = [
  'gitlab',
  'crypto'
];

const cryptoHelp = () => {
  const responseEmbed = new MessageEmbed()
    .setAuthor(process.env.AUTHOR)
    .setTitle(`How to use crypto function`)
    .setDescription(`To use check please specifiy symbol and data interval in that order
Ex. *!check BTCBIDR 1m*
Available interval can be seen here:`)
    .setImage('https://i.ibb.co/1snxHD1/Screenshot-3.png')
    .setFooter('Data provided by https://api.binance.cc')
  return responseEmbed
};

const argumentList: any = {
  gitlab: {
    help: 'This is a bot for connecting between Gitlab webhook and Discord Bot',
    integration: `Please follow these instruction:
  1. Open ${process.env.GITLAB_URL}/{user_name}/{project_name}/settings/integrations
  2. Add ||${process.env.HOST}|| to URL
  3. Add
  ||${process.env.WEBHOOK_TOKEN}||
  to secret token
  4. Only tick push event, other event is still on progress
  *Note: Only ${process.env.GITLAB_URL} will work`
  },
  crypto: {
    check: (symbol: string, interval: string) => calculate(symbol, interval),
    help: cryptoHelp
  }
}

export async function commands(cmd: string, args: Array<string>) {
  if (!commandList.includes(cmd))
    return `Our command list are: ${commandList}`
  if (args?.length === 0)
    return `Our argument for ${cmd} are: ${Object.keys(argumentList[cmd])}`
  if (!argumentList[cmd][args[0]])
    return `Our argument for ${cmd} are: ${Object.keys(argumentList[cmd])}`
  if (cmd === 'gitlab') {
    const responseEmbed = new MessageEmbed()
      .setTitle(`${cmd}, ${args[0]}`)
      .setAuthor(process.env.AUTHOR)
      .setDescription(argumentList[cmd][args[0]])
      .setImage(args[0] === 'integration' && cmd === 'gitlab' ? 'https://i.ibb.co/dQpyThf/download-1.png' : '')
    return responseEmbed
  }
  const [arg,symbol, interval] = args
  const responseEmbed = argumentList[cmd][arg]
  return await responseEmbed(symbol, interval)
}