import { Router, Request, Response } from 'express'
import { gitlabWebhook } from './controllers/gitlab'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  return res.status(200).send('Hello World!')
})

router.post('/webhook', gitlabWebhook)

export { router }