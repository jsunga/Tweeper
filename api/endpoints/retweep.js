const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

//get all user retweeps
router.get('/get/:user_id', isAuthenticated, (req, res) => {
  const userId = req.params.user_id

  db.any(`SELECT * FROM retweeps WHERE user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(204)
  })
  
})

//retweep
router.post('/', isAuthenticated, (req, res) => {
  const userId = req.user.user_id
  const { tweepId } = req.body
  const retweepArr = [userId, tweepId]
  db.one(`INSERT INTO retweeps (user_id, tweep_id)
    VALUES ($1, $2) returning tweep_id`, retweepArr
  )
  .then(data => {
    res.status(201)
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

module.exports = router