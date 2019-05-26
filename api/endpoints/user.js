const express = require('express')
const router = express.Router()
const { db } = require('../db')
const bcrypt = require('bcryptjs')
const { authenticate } = require('../authentification/passport')
const isAuthenticated = require('../authentification/isAuthenticated')
const validator = require('../authentification/validate')

const SALT = 8

//get basic information of a user
router.get('/get/:user_id', isAuthenticated, (req, res) => {
  const userId = req.params.user_id

  db.one(`SELECT * FROM users WHERE user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(204)
  })
})

//register
router.post('/register', (req, res, next) => {
  const { username, firstname, lastname, password } = req.body

  if( !validator.inputValidation(username, firstname, lastname, password, res)) return

  bcrypt.hash(password, SALT, (err, hash) => {
    db.one(`INSERT INTO users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4) RETURNING user_id`,
    [username, firstname, lastname, hash])
    .then(userid => {
      req.login(userid, err => {
        if(err) {
          return next(err)
        }
        res.json(userid)
      })
    })
    .catch(err => {
      validator.dbInvalidHandler(err, res)
    })
  })
})

//login
router.post('/login', authenticate)

//logout
router.post('/logout', (req, res) => {
  req.logout()
  res.send('logged out')
})

router.get('/protected', isAuthenticated, (req, res) => {
  res.send('inside of protected route')
})

module.exports = router