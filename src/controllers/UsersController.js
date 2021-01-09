import * as UsersModel from '../models/Users'
import pino from 'pino'
const logger = pino({ prettyPrint: true })

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const response = await UsersModel.login({ email, password })
    res.json(response)
  } catch (error) {
    const status = error.message.match(/wrong email or password/im) ? 401 : 500
    logger.error(error)
    res.status(status).send({ error: error.message })
  }
}

const logoff = async (req, res) => {
  try {
    const { token } = req
    await UsersModel.logoff({ token })
    res.send({ message: 'Logoff success' })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ error: error.message })
  }
}

const save = async (req, res) => {
  try {
    const { name, email, password } = req.body
    await UsersModel.save({ name, email, password })
    res.send({ message: 'User succesfuly registered' })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ error: error.message })
  }
}

export {
  login,
  logoff,
  save
}