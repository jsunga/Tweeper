const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

//get all the replies of a tweep
router.get('/get/:tweep_id', isAuthenticated, (req, res) => {
  const tweepId = req.params.tweep_id

  db.any(`SELECT * FROM replies WHERE tweep_id=$1`, [tweepId])
  .then(data => {
    res.send(data)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(404)
  })

})

//reply to a tweep
router.post('/', isAuthenticated, (req, res) => {
  const userId = req.user.user_id
  const { tweepId, content } = req.body
  const replyArr = [userId, tweepId, content]
  
  db.one(`INSERT INTO replies (replier_user_id, tweep_id, content)
    VALUES ($1, $2, $3) returning content`, replyArr
  )
  .then(() => {
    db.one(`UPDATE tweeps SET total_replies = total_replies + 1 WHERE tweep_id=$1`, [tweepId])
    res.send('success')
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })

})

module.exports = router