import express from 'express'
import cors from 'cors'
import { connect } from 'mongoose'
import { serve, setup } from 'swagger-ui-express'
import { join } from 'path'
import config from 'config'

import swaggerDocument from './swagger.json'
import routes from './routes'
import errorHandler from './middleware/error.middleware'


const PORT = config.get('port') ?? 3001
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use('/api', routes)

app.use('/api-docs', serve, setup(swaggerDocument))

app.use(errorHandler)

app.use('/uploads', express.static(join(__dirname, '..', 'uploads')))

async function start() {
  try {
    await connect(config.get('mongoUrl'))
    app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`))
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}

start()


