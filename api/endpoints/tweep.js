const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')
const validator = require('../authentification/validate')

//get all the tweeps of a user
router.get('/get/:user_id', isAuthenticated, (req, res) => {
  const userId = req.params.user_id

  db.any(`SELECT * FROM tweeps WHERE user_id=$1`, [userId])
  .then(tweeps => {
    res.send(tweeps)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(204)
  })
})

//post a tweep
router.post('/', isAuthenticated, (req, res) => {
  const { content } = req.body
  const userId= req.user.user_id
  const tweepArr = [userId, content]
  db.one(`INSERT INTO tweeps(
    user_id, content ) VALUES ($1, $2) returning tweep_id`,
    tweepArr
  )
  .then(tweep_id => {
    res.status(201)
    res.send(tweep_id)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

module.exports = router