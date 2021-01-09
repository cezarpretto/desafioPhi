import { checkToken } from '../models/Jwt'
const notToValidate = [
  'login'
]
const tokenMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    const needsValidation = !notToValidate.some(route => req.path.includes(route))
    if (needsValidation) {
      const user = await checkToken(authorization)
      const token = authorization.trim().replace(/^Bearer: /g, '')
      req.user = user
      req.token = token
      return next()
    } else {
      return next()
    }
  } catch (error) {
    return res.status(401).send({ error: error.message })
  }
}

export default tokenMiddleware