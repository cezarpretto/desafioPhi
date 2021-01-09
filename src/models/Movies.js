import { pool } from '../utils/mariadb'
import camelcaseKeys from 'camelcase-keys'

const getMovies = async ({ title = '' } = {}) => {
  let connection
  try {
    connection = await pool.getConnection()
    const result = await connection.query(`
      SELECT
        a.id,
        a.title,
        a.synopsis,
        a.director,
        a.amount - (SELECT COUNT(*) FROM rents WHERE id_movie = a.id AND \`status\` = 'rented') as total_remaining
      FROM 
        movies a
      WHERE
	      ${ title ? `MATCH(a.title) AGAINST ('${title}')` : 'TRUE' }
      GROUP BY 
        a.id
    `)

    return camelcaseKeys(JSON.parse(JSON.stringify(result)))
  } catch (error) {
    throw error
  } finally {
    if (connection) connection.release()
  }
}

const getMovie = async (id) => {
  let connection
  try {
    connection = await pool.getConnection()
    const result = await connection.query(`
      SELECT
        a.id,
        a.title,
        a.synopsis,
        a.amount - (SELECT COUNT(*) FROM rents WHERE id_movie = a.id AND \`status\` = 'rented') as total_remaining
      FROM 
        movies a
      WHERE
        a.id = ?
      GROUP BY 
        a.id
    `, [id])
    const [movie] = result
    if (!movie) throw new Error('The movie does not exists')
    return camelcaseKeys(movie)
  } catch (error) {
    throw error
  } finally {
    if (connection) connection.release()
  }
}

export {
  getMovies,
  getMovie
}