const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

//get all the replies of a tweep
router.get('/get/:tweep_id', isAuthenticated, async (req, res) => {
  const tweepId = req.params.tweep_id

  try {
    let replies = await db.many(`
      SELECT replies.tweep_id, replies.content, replies.date_created,
      replies.replier_user_id, users.username, users.image_url
      FROM replies
      INNER JOIN users ON replies.replier_user_id=users.user_id
      WHERE replies.tweep_id = $1
      ORDER BY date_created DESC
    `, [tweepId])
    await asyncForEach(replies, async item => {
      item.date_created = new Date(item.date_created).toDateString()
    })
    res.send(replies)
  }
  catch(err) {
    console.log(err)
    res.sendStatus(404)
  }
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

asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = router