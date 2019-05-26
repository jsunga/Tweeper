/**
 * helper functions for validation
 */
const validateUsername = (username, res) => {
  if( username === undefined ) {
    console.log('invalid username: ' + username)
    res.status(400)
    res.send('invalid username')

    return false
  }
  return true
}

const validateName = (first, last, res) => {
  if(typeof first !== 'string' || first.length === 0 ||
      typeof last !== 'string' || last.length === 0) {
    console.log('invalid name input')
    res.status(400)
    res.send('invalid name input')

    return false
  }
  return true
}

const validatePassword = (password, res) => {
  if(typeof password !== 'string' || password.length < 6) {
    console.log('invalid password length')
    res.status(400)
    res.send('invalid password length')
    return false
  }
  return true
}

const inputValidation = (username, first, last, password, res) => {
  return ( validateUsername(username, res) && validateName(first, last, res) && validatePassword(password, res) )
}

const dbInvalidHandler = (err, res) => {
  if(err.constraint === 'user_ukey') {
    console.log('inside of username err: ' + err.constraint)
    res.status(400)
    res.send('username already used')
  } else if(err.column === 'firstname' || err.column === 'lastname') {
    console.log('error at: ' + err.column)
    res.status(400)
    res.send('invalid ' + err.column) 
  } else {
    console.log('something else went wrong')
    res.status(400)
    res.send('something else went wrong')
  }
}

module.exports = {
  inputValidation,
  dbInvalidHandler
}