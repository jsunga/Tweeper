const express = require('express')
const router  = express.Router()

const user = require('./user')
const auth = require('./auth')
const tweep = require('./tweep')
const follow = require('./follow')
const like = require('./like')
const reply = require('./reply')
const retweep = require('./retweep')

router.use('/user', user)
router.use('/auth', auth)
router.use('/tweep', tweep)
router.use('/follow', follow)
router.use('/like', like)
router.use('/reply', reply)
router.use('/retweep', retweep)

module.exports = router