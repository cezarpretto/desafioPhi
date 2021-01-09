import Joi from 'joi'

const getMoviesSchema = Joi.object({
  title: Joi.string().allow(null, '')
})

const rentMovieSchema = Joi.object({
  idMovie: Joi.number().strict().integer().required()
})

const returnMovieSchema = Joi.object({
  idMovie: Joi.number().strict().integer().required()
})

export {
  getMoviesSchema,
  rentMovieSchema,
  returnMovieSchema
}
