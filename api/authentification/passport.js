const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const bcrypt = require('bcryptjs')

const { db } = require('../db')


const checkPassword = password => user => {
  return new Promise ((resolve, reject) => {
    bcrypt.compare(password, user.password)
    .then(isEqual => {
      if(isEqual === true) {
        return resolve(user)
      }
      return reject( new Error('Invalid credentials'))
    })
  })
}

passport.serializeUser((user, done) => {
  done(null, user.user_id)
})

passport.deserializeUser((id, done) => {
  db.one(`SELECT user_id, username FROM users WHERE user_id=$1`, [id])
  .then(user => done(null, user))
  .catch(error => done(error, {}))
})

passport.use(new LocalStrategy({
    usernameField: 'username'
  },
  (username, password, done) => {
    db.one(`SELECT * FROM users WHERE username=$1`, [username])
    .then(user => {
      const validUser = checkPassword(password)
      const userObj = validUser(user)
      return userObj
    })
    .then(user => done(null, user))
    .catch(error => done(null, false, error.message))
  }
))

const authSetting = {
  successRedirect: '../auth/success',
  failureRedirect: '../auth/failure'
}

module.exports = {
  passport,
  authenticate: passport.authenticate('local', authSetting)
}