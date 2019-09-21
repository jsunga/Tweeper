const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

//get timeline of user
router.get('/get/timeline', isAuthenticated, async (req, res) => {
  const userId = req.user.user_id
  try {
    let timeline = await db.many(`
      SELECT tweeps.tweep_id, tweeps.user_id, tweeps.content, 
      retweeps.date_created, tweeps.total_likes, tweeps.total_replies, 
      tweeps.total_retweeps, O.username, O.image_url, R.username as retweeper_username 
      FROM retweeps
      INNER JOIN tweeps on retweeps.tweep_id=tweeps.tweep_id 
      INNER JOIN users as O on tweeps.user_id=O.user_id
      INNER JOIN users as R on retweeps.user_id=R.user_id
      WHERE retweeps.user_id in (
        SELECT following_user_id 
        FROM following 
        WHERE user_id=$1
      )
      UNION
      SELECT tweeps.tweep_id, tweeps.user_id, tweeps.content, 
      tweeps.date_created, tweeps.total_likes, tweeps.total_replies, 
      tweeps.total_retweeps, users.username, users.image_url, users.username as retweeper_username 
      FROM tweeps 
      INNER JOIN users on tweeps.user_id=users.user_id 
      WHERE tweeps.user_id in (
        SELECT following_user_id 
        FROM following 
        WHERE user_id=$1
      )
      ORDER BY date_created DESC
    `, [userId])
    await asyncForEach(timeline, async item => {
      item.date_created = new Date(item.date_created).toDateString()
    })
    res.send(timeline)
  }
  catch(err) {
    res.send(err.message)
  }
})

//get user profile feed
router.get('/get/profile/:username', isAuthenticated, async (req, res) => {
  const userName = req.params.username
  try {
    let profile = await db.many(`
      SELECT tweeps.tweep_id, tweeps.content, tweeps.date_created, tweeps.total_likes, tweeps.total_replies, tweeps.total_retweeps, tweeps.user_id, users.username, users.image_url
      FROM tweeps 
      INNER JOIN users on tweeps.user_id=users.user_id
      WHERE tweeps.user_id in (
        SELECT user_id FROM users WHERE username=$1
      )
      UNION
      SELECT tweeps.tweep_id, tweeps.content, retweeps.date_created, tweeps.total_likes, tweeps.total_replies, tweeps.total_retweeps, tweeps.user_id, users.username, users.image_url
      FROM retweeps
      INNER JOIN tweeps on retweeps.tweep_id=tweeps.tweep_id
      INNER JOIN users on tweeps.user_id=users.user_id
      WHERE retweeps.user_id in (
        SELECT user_id FROM users WHERE username=$1
      )
      ORDER BY date_created DESC
    `, [userName])
    await asyncForEach(profile, async item => {
      item.date_created = new Date(item.date_created).toDateString()
    })
    res.send(profile)
  }
  catch(err) {
    res.send(err.message)
  }
})

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
  db.one(`
    SELECT users.user_id, users.username, users.firstname, users.lastname, users.image_url, 
    tweeps.tweep_id, tweeps.content, tweeps.date_created
    FROM tweeps
    INNER JOIN users ON tweeps.user_id=users.user_id
    WHERE tweeps.tweep_id = $1
  `, [tweepId])
  .then(data => {
    data.date_created = new Date(data.date_created).toDateString()
    data.firstname = data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1)
    data.lastname = data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1)
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

asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = router