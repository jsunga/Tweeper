const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

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