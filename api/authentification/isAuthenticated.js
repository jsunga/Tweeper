const isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) {
    const locals = res.locals.user = req.user
    locals.isAuthenticated = true
 
    next()
  } else {
   console.log('unauthorized')
    res.sendStatus(401)
  }
 }
 
 module.exports = isAuthenticated