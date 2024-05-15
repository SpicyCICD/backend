const jwt = require('jsonwebtoken')
const UserModel = require('../models/nodeDb/user.model')

const validateToken = async (req, res, next) => {
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
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }
    const userModel = await UserModel.findOne({ where: { uid: user.uid } })
    if (!userModel) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    if (userModel.sessionId !== token) {
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }
    if (userModel.expiry < new Date()) {
      return res.status(402).json({
        message: 'Unauthorized'
      })
    }

    req.user = user
    console.log('user', user)
    next()
  })
}

module.exports = validateToken