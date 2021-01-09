import { pool } from '../utils/mariadb'
import { getMovie } from './Movies'

const isValidStatus = (status = '') => ['rented', 'returned'].includes(status.toLowerCase())

/**
 * Update rent status
 * @param {Object} input - The user
 * @param {Object} input.user - The user
 * @param {Integer} input.user.id - The user ID
 * @param {Integer} input.idMovie - The movie ID
 * @param {String} input.status - It must be 'rented' or 'returned'
 * @return {Void}
 */
const updateRentStatus = async ({ user: { id }, idMovie = 0, status = '' }) => {
  let connection
  try {
    if (!isValidStatus(status)) throw new Error('Invalid status')
    connection = await pool.getConnection()
    await connection.query('START TRANSACTION;')
    await connection.query(`
      UPDATE 
        rents
      SET 
        \`status\` = '${status}',
        returned_at = ${ status === 'returned' ? 'NOW()' : 'null' }
      WHERE
        id_movie = ? and
        id_user = ?;
    `, [idMovie, id])
    await connection.query('COMMIT;')
    return
  } catch (error) {
    await connection.query('ROLLBACK;')
    throw error
  } finally {
    if (connection) connection.release()
  }
}

/**
 * Rent a movie
 * @param {Object} input
 * @param {Object} input.user - The user
 * @param {Integer} input.user.id - The user ID
 * @param {Integer} input.idMovie - The movie ID
 * @return {Void}
 */
const rentMovie = async ({ user: { id }, idMovie }) => {
  try {
    const { totalRemaining } = await getMovie(idMovie)
    if (totalRemaining <= 0) throw new Error('All copies of the movie have already been rented')
    await updateRentStatus({ user: { id }, idMovie, status: 'rented' })
    return
  } catch (error) {
    throw error
  }
}

/**
 * Return a movie
 * @param {Object} input
 * @param {Object} input.user - The user
 * @param {Integer} input.user.id - The user ID
 * @param {Integer} input.idMovie - The movie ID
 * @return {Void}
 */
const returnMovie = async ({ user: { id }, idMovie }) => {
  try {
    await updateRentStatus({ user: { id }, idMovie, status: 'returned' })
    return
  } catch (error) {
    throw error
  }
}

export {
  isValidStatus,
  rentMovie,
  returnMovie
}