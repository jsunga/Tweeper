    
const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

//get retweeps of user
router.get('/get/:user_id', (req ,res) => {
  const userId = req.params.user_id
  db.many(`SELECT * FROM retweeps WHERE user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(404)
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
    db.one(`UPDATE tweeps SET total_retweeps = total_retweeps + 1 WHERE tweep_id=$1`, [tweepId])
    res.send('success')
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

//undo retweep
router.delete(`/undo/:tweep_id`, isAuthenticated, async (req, res) => {
  const userId = req.user.user_id
  const tweepId = req.params.tweep_id
  try {
    await db.none(`delete from retweeps where tweep_id=$1 and user_id=$2`, [tweepId, userId])
    await db.none(`update tweeps set total_retweeps = total_retweeps - 1 where tweep_id=$1`, [tweepId])
    res.send('success')
  }
  catch(err) {
    console.log(err)
    res.sendStatus(400)
  }
})

module.exports = router