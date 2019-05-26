const express = require('express')
const router = express.Router()
const isAuthenticated = require('../authentification/isAuthenticated')

router.get('/success', isAuthenticated, (req, res) => {
  console.log('login success')
  const { user } = res.locals
  res.send(user)
})

router.get('/failure', (req, res) => {
  console.log('login failed')
  res.status(401)
  res.send('login failed')
})

module.exports = router