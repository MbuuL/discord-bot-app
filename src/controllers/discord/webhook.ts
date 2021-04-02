/** Module */
import { WebhookClient, MessageEmbed } from 'discord.js'
import { gitlabResponse } from '../../interfaces'

function loginWebhook() {
  const hook = new WebhookClient(process.env.WEBHOOK_ID ?? '', process.env.WEBHOOK_TOKEN ?? '')
  return hook
}

function getAvatarURL(str: string) {
  if (str == null) return "";
  if (str.startsWith('/')) return process.env.GITLAB_URL + str;
  return str;
}

export function sendEmbed(msg: gitlabResponse) {
  console.log(msg)
  const hook = loginWebhook()
  let description = ''
  msg.commits.forEach((x: any) => {
    description += `${x.message}\n`
  })
  const embed = new MessageEmbed()
    .setTitle(`Gitlab ${msg.project.namespace} ${msg.event_name}`)
    .setAuthor(msg.user_name, getAvatarURL(msg.user_avatar))
    .setURL(msg.project.web_url)
    .setDescription(description)
    .setColor('fc6d26')
  hook.send(embed)
}