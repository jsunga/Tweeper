const session = require('express-session')
const PgSession = require('connect-pg-simple')(session)

const { connection } = require('../api/db')

const sessionMiddleware = session({
  store: new PgSession({
    conString: connection
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
})

module.exports = sessionMiddleware