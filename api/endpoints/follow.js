const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

/*
todo:
check if user is already following
*/

//get user following list
router.get('/get_following/:user_id', isAuthenticated, (req, res) => {
  const userId = req.params.user_id

  db.any(`SELECT following_user_id FROM following WHERE user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(404)
  })
})

router.get('/get_followers/:user_id', isAuthenticated, (req, res) => {
  const userId = req.params.user_id
  db.any(`SELECT user_id FROM following WHERE following_user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(404)
  })
})

//follow a user
router.post('/', isAuthenticated, (req ,res) => {
  const userId = req.user.user_id
  const { following_userId } = req.body
  const followArr = [userId, following_userId]
  db.one(`INSERT INTO following (user_id, following_user_id)
    VALUES ($1, $2) returning following_user_id`, followArr
  )
  .then(() => {
    db.one(`UPDATE users SET following = following + 1 WHERE user_id=$1 returning user_id`, [userId])
    db.one(`UPDATE users SET followers = followers + 1 WHERE user_id=$1`, [following_userId])
    res.send('success')
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
})

//unfollow a user
router.delete(`/delete/:following_user_id`, isAuthenticated, async (req, res) => {
  const userId = req.user.user_id
  const following_userId = req.params.following_user_id
  try {
    await db.none(`delete from following where user_id=$1 and following_user_id=$2`, [userId, following_userId])
    await db.none(`update users set following = following - 1 where user_id=$1`, [userId])
    await db.none(`update users set followers = followers - 1 where user_id=$1`, [following_userId])
    res.send('success')
  }
  catch(err) {
    console.log(err)
    res.sendStatus(400)
  }
})

module.exports = router