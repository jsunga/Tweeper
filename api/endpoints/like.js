const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

//get how many likes a tweep has
router.get('/get/:tweep_id', isAuthenticated, (req, res) => {
  const tweepId = req.params.tweep_id

  db.one(`SELECT COUNT(replier_user_id), tweep_id FROM likes GROUP BY tweep_id HAVING tweep_id=$1`, [tweepId])
  .then(data => {
    res.send(data)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(404)
  })

})

//like a tweep
router.post('/', isAuthenticated, (req, res) => {
  const userId = req.user.user_id
  const { tweepId } = req.body
  const likeArr = [userId, tweepId]
  db.one(`INSERT INTO likes (liker_user_id, tweep_id)
    VALUES ($1, $2) returning liker_user_id`, likeArr
  )
  .then(() => {
    db.one(`UPDATE tweeps SET total_likes = total_likes + 1 WHERE tweep_id=$1`, [tweepId])
    res.send('success')
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

module.exports = router