import express from 'express'
import joiValidation from 'express-joi-validation'
import { getMovies, rentMovie, returnMovie } from '../controllers/MoviesController'
import { getMoviesSchema, rentMovieSchema, returnMovieSchema } from '../controllers/MoviesSchema'

const validator = joiValidation.createValidator({})

const app = express()

app.get('/movies', validator.query(getMoviesSchema), getMovies)
app.post('/movie/rent', validator.body(rentMovieSchema), rentMovie)
app.post('/movie/return', validator.body(returnMovieSchema), returnMovie)

export default app