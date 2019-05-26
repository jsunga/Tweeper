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
    res.sendStatus(204)
  })
})

//get how many users a user is following
router.get('/get_num_following/:user_id', isAuthenticated, (req, res) => {
  const userId = req.params.user_id
  
  db.one(`SELECT COUNT(following_user_id), user_id FROM following GROUP BY user_id HAVING user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(204)
  })
})

//get how many followers a user has
router.get('/get_num_followers/:user_id', isAuthenticated, (req, res) => {
  const userId = req.params.user_id
  
  db.one(`SELECT COUNT(user_id), following_user_id FROM following GROUP BY following_user_id HAVING following_user_id=$1`, [userId])
  .then(data => {
    res.send(data)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(204)
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