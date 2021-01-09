import jwt from 'jsonwebtoken'
import { pool } from '../utils/mariadb'

const JWT_SECRET = process.env.JWT_SECRET

const saveToken = async ({ user: { id }, token = '' }) => {
  let connection
  try {
    if (!token.trim()) throw new Error('Token is required')
    connection = await pool.getConnection()
    await connection.query('START TRANSACTION;')
    await connection.query(`
      INSERT INTO sessions (
        id_user, 
        token, 
        \`status\`
      ) VALUES (?, ?, 'enabled');
    `, [id, token])
    
    await connection.query('COMMIT;')
    return
  } catch (error) {
    await connection.query('ROLLBACK;')
    throw error
  } finally {
    if (connection) connection.release()
  }
}

const disableToken = async ({ token = '' }) => {
  let connection
  try {
    if (!token.trim()) throw new Error('Token is required')
    connection = await pool.getConnection()
    await connection.query('START TRANSACTION;')
    await connection.query(`
      UPDATE 
        sessions 
      SET
        \`status\` = 'disabled'
      WHERE
        token = ?;
    `, [token])

    await connection.query('COMMIT;')
    return
  } catch (error) {
    if (connection) await connection.query('ROLLBACK;')
    throw error
  } finally {
    if (connection) connection.release()
  }
}

const getToken = async ({ token = '' }) => {
  let connection
  try {
    if (!token.trim()) throw new Error('Token is required')
    connection = await pool.getConnection()
    const result = await connection.query(`
      SELECT \`status\` from sessions where token = ?;
    `, [token])
    const [ response ] = result
    if (!response) throw new Error('Token is invalid')
    if (response.status === 'disabled') throw new Error('Token is expired')
    return token
  } catch (error) {
    throw error
  } finally {
    if (connection) connection.release()
  }
}

const generateJWT = (user) => {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '150 years' })
  return token
}

const checkToken = async (token = '') => {
  try {
    const sanitizedToken = token.trim().replace(/^Bearer: /, '').trim()
    if (!sanitizedToken) throw new Error('Token is required')
    const data = jwt.verify(sanitizedToken, JWT_SECRET)
    await getToken({ token: sanitizedToken })
    const { id, name, email } = data
    return {
      id,
      name,
      email
    }
  } catch (error) {
    if (error.message === 'jwt malformed') throw new Error('Token is invalid')
    if (error.message === 'jwt expired') throw new Error('Token is expired')
    throw error
  }
}

const createToken = async (user) => {
  const token = generateJWT(user)
  await saveToken({ user, token })
  return `Bearer: ${token}`
}

export {
  disableToken,
  createToken,
  checkToken,
  getToken
}