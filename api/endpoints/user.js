const express = require('express')
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
router.get('/get/:user_id', isAuthenticated, (req, res) => {
  const userId = req.params.user_id

  db.one(`SELECT * FROM users WHERE user_id=$1`, [userId])
  .then(data => {
    const image = data.image_url
    data.image_url = assetResolver(image)
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(404)
  })
})

//get basic information of a user using username
router.get('/retrieve/:user', (req, res) => {
  const username = req.params.user

  db.one(`SELECT * FROM users WHERE username=$1`, [username])
  .then(data => {
    const image = data.image_url
    data.image_url = assetResolver(image)
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(404)
  })
})

//get all users in the database
router.get('/all', isAuthenticated, async (req, res) => {
  try {
    let users = await db.many(`select * from users`)
    await asyncForEach(users, async item => {
      item.image = assetResolver(item.image_url)
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
    
    const relativePath = req.file.path.substring(10)
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