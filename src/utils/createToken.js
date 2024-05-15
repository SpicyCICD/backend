const jwt = require('jsonwebtoken')
const UserModel = require('../models/nodeDb/user.model')

const createToken = async (user) => {
  const token = await jwt.sign({
    uid: user.uid,
    userRoleId: user.userRoleId // Change 'role' to 'userRoleId'
  }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })
  const expiry = jwt.decode(token).exp
  return { token, expiry }
}

module.exports = createToken
