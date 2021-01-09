import dotenv from 'dotenv'
import mariadb from 'mariadb'

dotenv.config()
const pool = mariadb.createPool({ 
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

export {
  pool
}