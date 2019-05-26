const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

//get user following list
router.get('/get/:user_id', isAuthenticated, (req, res) => {
  const userId = req.params.user_id

  db.any(`SELECT following_user_id FROM following WHERE user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(204)
  })
})

//get how many users a user is following
router.get('/howmany/:user_id', (req, res) => {
  const userId = req.params.user_id
  
  db.any(`SELECT COUNT(following_user_id), user_id FROM following GROUP BY user_id HAVING user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(204)
  })
})

//get how many followers a user has
router.get('/howmany/:user_id', (req, res) => {
  const userId = req.params.user_id
  
  db.any(`SELECT COUNT(following_user_id), user_id FROM following GROUP BY user_id HAVING user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(204)
  })
})

module.exports = router