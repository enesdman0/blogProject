const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth')

const isNotAuth = require('../middlewares/isNotAuth')
const isAuth = require('../middlewares/isAuth')

// Register
router.get('/register', isNotAuth, authController.get_register)
router.post('/register', isNotAuth, authController.post_register)

// Login
router.get('/login', isNotAuth, authController.get_login)
router.post('/login', isNotAuth, authController.post_login)

// Log out
router.get('/logout', isAuth, authController.logout)

module.exports = router