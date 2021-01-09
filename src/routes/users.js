import express from 'express'
import joiValidation from 'express-joi-validation'
import { login, logoff, save } from '../controllers/UsersController'
import { loginSchema, userSchema } from '../controllers/UsersSchema'

const app = express()

const validator = joiValidation.createValidator({})

app.post('/login', validator.body(loginSchema), login)
app.post('/logoff', logoff)
app.post('/user', validator.body(userSchema), save)

export default app