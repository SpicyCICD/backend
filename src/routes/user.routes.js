const express = require('express')
const router = express.Router()
const registerUser = require('../controllers/user/register')
const loginUser = require('../controllers/user/login')
const logout = require('../controllers/user/logout')
const verify = require('../controllers/user/verify')
const forgotPassword = require('../controllers/user/forgotPassword')
const resetPassword = require('../controllers/user/resetPassword')


router.post('/', registerUser)

router.post('/verify/:verificationToken', verify)

router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword', resetPassword)

router.post('/login', loginUser)

router.post('/logout', logout)

module.exports = router