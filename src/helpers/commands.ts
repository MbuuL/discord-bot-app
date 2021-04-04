/** Modules */
import { MessageEmbed } from 'discord.js'

const commandList = [
  'gitlab',
];

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
}

export async function commands(cmd: string, args: Array<string>) {
  if (!commandList.includes(cmd))
    return `Our command list are: ${commandList}`
  if (args?.length === 0)
    return `Our argument for ${cmd} are: ${Object.keys(argumentList[cmd])}`
  const responseEmbed = new MessageEmbed()
    .setTitle(`${cmd}, ${args[0]}`)
    .setAuthor(process.env.AUTHOR)
    .setDescription(argumentList[cmd][args[0]])
    .setImage(args[0] === 'integration' && cmd === 'gitlab' ? 'https://i.ibb.co/dQpyThf/download-1.png' : '')
  return responseEmbed
}