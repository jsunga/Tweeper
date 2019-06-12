const express = require('express')
const router = express.Router()
const { db } = require('../db')
const isAuthenticated = require('../authentification/isAuthenticated')

//create a new conversation
router.post(`/new`, isAuthenticated, async (req, res) => {
  const from_userId = req.user.user_id
  const { to_userId } = req.body
  try {
    db.one(`insert into conversations (from_user_id, to_user_id) values ($1, $2) returning conversation_id`, [from_userId, to_userId])
    res.send('success')
  }
  catch(err) {
    console.log(err)
  }
})

//check if a conversation already exists
router.get('/check/:user_id', isAuthenticated, async (req, res) => {
  const from_userId = req.user.user_id
  const to_userId = req.params.user_id
  try {
    await db.one(`select * from conversations where ( (from_user_id=$1 AND to_user_id=$2) OR (from_user_id=$2 AND to_user_id=$1) )`,
    [from_userId, to_userId])
    res.send('conversation already exists')
  }
  catch(err) {
    res.send('create')
  }
})

//get list of conversations
router.get('/myMessages', isAuthenticated, async (req, res) => {
  const userId = req.user.user_id
  try {
    let messageList = await db.any(`select * from conversations where from_user_id=$1 or to_user_id=$1`, [userId])
    res.send(messageList)
  }
  catch(err) {
    console.log(err)
    res.sendStatus(400)
  }
})

//send a message to someone
router.post(`/send`, isAuthenticated, async (req, res) => {
  const userId = req.user.user_id
  const { message, to_userId } = req.body
  try {
    let messageId = await db.one(`insert into messages (message, owner_id) values ($1, $2) returning message_id`, [message, userId])
    await db.none(`insert into user_messages (message_id, sending_user_id, receiving_user_id) values ($1, $2, $3)`,
    [messageId.message_id, userId, to_userId])
    res.send('sent message')
  }
  catch(err) {
    console.log(err)
    res.sendStatus(400)
  }
})

//get list of messages in a conversation
router.get('/receive/:to_user_id', isAuthenticated, async (req, res) => {
  const userId = req.user.user_id
  const to_userId = req.params.to_user_id
  try {
    let messageIdObject = await db.any(`select message_id from user_messages where ( (sending_user_id=$1 AND receiving_user_id=$2) OR (sending_user_id=$2 AND receiving_user_id=$1) )`,
    [userId, to_userId])
    let messageIdList = messageIdObject.map(messageId => messageId.message_id)
    let messageList = await db.any(`select * from messages where message_id in ($1:csv)`, [messageIdList])
    res.send(messageList)
  }
  catch(err) {
    console.log(err)
    res.sendStatus(400)
  }
})

module.exports = router