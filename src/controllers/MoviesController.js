import * as MoviesModel from '../models/Movies'
import * as Rent from '../models/Rent'
import pino from 'pino'
const logger = pino({ prettyPrint: true })

const getMovies = async (req, res) => {
  try {
    const { title } = req.query
    const response = await MoviesModel.getMovies({ title })
    res.json(response)
  } catch (error) {
    logger.error(error)
    res.status(500).send({ error: error.message })
  }
}


const rentMovie = async (req, res) => {
  try {
    const { id } = req.user
    const { idMovie } = req.body
    await Rent.rentMovie({ user: { id }, idMovie })
    res.send({ message: 'The movie was rented' })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ error: error.message })
  }
}

const returnMovie = async (req, res) => {
  try {
    const { id } = req.user
    const { idMovie } = req.body
    await Rent.returnMovie({ user: { id }, idMovie })
    res.send({ message: 'The movie was returned' })
  } catch (error) {
    logger.error(error)
    res.status(500).send({ error: error.message })
  }
}

export {
  getMovies,
  rentMovie,
  returnMovie
}