const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

//get tweeps of user
router.get('/get/:user_id', (req, res) => {
  const userId = req.params.user_id
  db.many(`SELECT * FROM tweeps WHERE user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(404)
  })
})

//get tweep using tweep_id
router.get(`/retrieve/:tweep_id`, (req, res) => {
  const tweepId = req.params.tweep_id
  db.one(`SELECT * FROM tweeps WHERE tweep_id=$1`, [tweepId])
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(404)
  })
})

//post a tweep
router.post('/', isAuthenticated, (req, res) => {
  const { content } = req.body
  const userId = req.user.user_id
  const tweepArr = [userId, content]
  db.one(`INSERT INTO tweeps(
    user_id, content ) VALUES ($1, $2) returning tweep_id`,
    tweepArr
  )
  .then(() => {
    db.one(`UPDATE users SET tweeps = tweeps + 1 WHERE user_id=$1 returning user_id`, [userId])
    res.send('success')
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

module.exports = router