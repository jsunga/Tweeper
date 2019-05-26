const pgp = require('pg-promise')()

let connection = ''

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
  connection = process.env.LOCAL_DATABASE_URL
} else {
  connection = process.env.DATABASE_URL
}

const db = pgp(connection)

module.exports = { db, connection }