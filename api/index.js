require('dotenv').config()

const express = require("express")
const bodyParser = require('body-parser')
const endpoints = require('./endpoints')
const { passport } = require('./authentification/passport')
const sessionMiddleware = require('../config/session')

const port = process.env.PORT || 5000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/assets', express.static('api/assets'))

app.use('/api', endpoints)

app.listen(port, () => console.log(`Listening on port ${port}`))