const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }
    req.user = user
    console.log('user', user)
    next()
  })
}

module.exports = checkToken
