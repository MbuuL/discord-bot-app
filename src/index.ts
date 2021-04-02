/** Module */
import express, { json, urlencoded } from 'express'
import dotenv from 'dotenv'

import { router } from './v1Router'
dotenv.config()

const app = express()
const port = process.env.PORT || 3030

app.use(json())
app.use(urlencoded({ extended: true }))

app.use('/v1', router)

app.listen(port, () => console.log(`Server listening to port ${port}`))