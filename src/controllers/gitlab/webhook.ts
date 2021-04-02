/** Module */
import { Request, Response } from 'express'

import { Success, Error } from '../../interfaces'
import { sendEmbed } from '../discord'

export function gitlabWebhook(req: Request, res: Response) {
  const headers = req.headers
  const body = req.body
  if (headers['x-gitlab-token'] !== process.env.WEBHOOK_TOKEN) {
    let data: Error = {
      status: 400,
      message: 'Bad Request',
      error: 'Invalid Token'
    }
    return res.status(400).send(data)
  }
  sendEmbed(body)
  let data: Success = {
    status: 200,
    message: 'OK'
  }
  return res.status(200).send(data)
}