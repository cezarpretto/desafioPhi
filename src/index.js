import express from 'express'
import pino from 'pino'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes'
import tokenMiddleware from './middlewares/TokenMiddleware'

dotenv.config()
const logger = pino({ prettyPrint: true })
const app = express()

app.use(cors())
app.use(express.json())
app.use(tokenMiddleware)
app.use(routes)

app.listen(process.env.PORT, () => {
  logger.info(`Listenning on port ${process.env.PORT}`)
})