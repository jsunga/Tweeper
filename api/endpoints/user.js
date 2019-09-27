const express = require('express')
const client = require('../db/redis-client')
const router = express.Router()
const { db } = require('../db')
const bcrypt = require('bcryptjs')
const { assetResolver } = require('../utils')
const upload = require('../../config/photoStorage')
const { authenticate } = require('../authentification/passport')
const isAuthenticated = require('../authentification/isAuthenticated')
const validator = require('../authentification/validate')
const SALT = 8

//get basic information of a user using user id
const getUser = async (req, res, next) => {
  const userId = req.params.user_id

  try {
    let data = await db.one(`SELECT * FROM users WHERE user_id=$1`, [userId])
    client.setex(data.user_id, 3600, JSON.stringify(data))
    res.send(data)
  } catch (err) {
    console.log(err)
    res.sendStatus(404)
  }
}

const getCache = (req, res, next) => {
  const userId = req.params.user_id

  client.get(userId, (err, data) => {
    if (err) throw err

    if (data) {
      console.log('getting from cache..')
      res.send(JSON.parse(data))
    } else {
      next()
    }
  })
}

router.get('/get/:user_id', getCache, getUser)

//get basic information of a user using username
const retrieveUser = async (req, res, next) => {
  const username = req.params.user

  try {
    let data = await db.one(`SELECT * FROM users WHERE username=$1`, [username])
    client.setex(data.username, 3600, JSON.stringify(data))
    console.log('fetching data..')
    res.send(data)
  } catch (err) {
    console.log(err)
    res.sendStatus(404)
  }
}

const retrieveCache = (req, res, next) => {
  const username = req.params.user

  client.get(username, (err, data) => {
    if (err) throw err

    if (data) {
      console.log('getting from cache..')
      res.send(JSON.parse(data))
    } else {
      next()
    }
  })
}

router.get('/retrieve/:user', retrieveCache, retrieveUser)

//get all users in the database
router.get('/all', isAuthenticated, async (req, res) => {
  try {
    let users = await db.many(`select * from users`)
    await asyncForEach(users, async item => {
      item.image = item.image_url
      item.title = item.username
    })
    res.send(users)
  }
  catch(err) {
    console.log(err)
  }
})

//user upload avatar photo
router.post('/upload', upload.single('avatar'), (req, res) => {
  const userId = req.user.user_id
  if(!req.file) {
    console.log('no file received')
    res.status(400)
    res.send('no file received')
  } else {
    console.log('file received')
    const relativePath = `http://13.52.178.103/api/assets${req.file.path.substring(10)}`
    console.log(relativePath)

    db.none(`update users set image_url=$2 where user_id=$1`, [userId, relativePath])
    .then( _ => {
      res.sendStatus(201)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
  }
})

//create an account
router.post('/register', (req, res, next) => {
  const { username, firstname, lastname, password } = req.body

  if( !validator.inputValidation(username, firstname, lastname, password, res)) return

  bcrypt.hash(password, SALT, (err, hash) => {
    db.one(`INSERT INTO users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4) RETURNING user_id, username`,
    [username, firstname, lastname, hash])
    .then(user => {
      req.login(user, err => {
        if(err) {
          return next(err)
        }
        res.json(user)
      })
    })
    .catch(err => {
      validator.dbInvalidHandler(err, res)
    })
  })
})

//login
router.post('/login', authenticate)

//logout
router.post('/logout', (req, res) => {
  req.logout()
  res.send('logged out')
})

router.get('/protected', isAuthenticated, (req, res) => {
  res.send('inside of protected route')
})

//async forEach method
asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = router