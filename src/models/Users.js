import { pool } from '../utils/mariadb'
import { createToken, disableToken } from './Jwt'
import sha256 from 'crypto-js/sha256'

/**
 * Logoff a user
 * @param {Object} input
 * @param {String} input.email - Email
 * @param {String} input.password - Password
 * @return {Void}
 */
const login = async ({ email = '', password = '' }) => {
  let connection
  try {
    connection = await pool.getConnection()
    const encriptedPassword = sha256(password).toString()
    const result = await connection.query(`
      SELECT
        a.id,
        a.name,
        a.email
      FROM
        users a
      WHERE
        a.email = ? and
        a.password = ?
    `, [email, encriptedPassword])

    const [user] = result
    if (!user) throw new Error('Wrong email or password')
    const token = await createToken(user)
    return {
      ...user,
      token
    }
  } catch (error) {
    throw error
  } finally { 
    if (connection) connection.release()
  }
}

/**
 * Logoff a user
 * @param {Object} input
 * @param {String} input.token - The user token
 * @return {Void}
 */
const logoff = async ({ token = '' }) => {
  try {
    await disableToken({ token })
  } catch (error) {
    throw error
  }
}

/**
 * Save a user
 * @param {Object} input
 * @param {String} input.name - Name
 * @param {String} input.email - Email
 * @param {String} input.password - Password
 * @return {Void}
 */
const save = async ({ name = '', email = '', password = '' }) => {
  let connection
  try {
    connection = await pool.getConnection()
    const encriptedPassword = sha256(password).toString()
    await connection.query('START TRANSACTION;')
    await connection.query(`
      INSERT INTO
        users (name, email, password)
      VALUES
        (?, ?, ?)
    `, [name, email, encriptedPassword])
    await connection.query('COMMIT;')
    return
  } catch (error) {
    await connection.query('ROLLBACK;')
    if (error.errno === 1062) throw new Error('This user is already registered')
    throw error
  } finally {
    if (connection) connection.release()
  }
}

export {
  login,
  logoff,
  save
}