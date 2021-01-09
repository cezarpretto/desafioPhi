import express from 'express'
import users from './users'
import movies from './movies'

const app = express()

app.use('/v1', [
  users,
  movies
])

export default app