const express = require('express')
const router  = express.Router()

const user = require('./user')
const auth = require('./auth')
const tweep = require('./tweep')
const following = require('./following')

router.use('/user', user)
router.use('/auth', auth)
router.use('/tweep', tweep)
router.use('/following', following)

module.exports = router