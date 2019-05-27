const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

//get retweeps of user
router.get('/get/:tweep_id', (req ,res) => {
  const tweepId = req.params.tweep_id
  db.many(`SELECT * FROM tweeps WHERE tweep_id=$1`, [tweepId])
  .then(data => {
    res.send(data)
  })
  .catch(() => {
    res.send('no tweeps')
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
  .then(() => {
    db.one(`UPDATE users SET tweeps = tweeps + 1 WHERE user_id=$1`, [userId])
    res.send('success')
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

module.exports = router