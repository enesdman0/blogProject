const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')
const isAuth = require('../middlewares/isAuth')

const imageUplaod = require('../helpers/image-upload')
const isAuthor = require('../middlewares/isAuthor')

// Index
router.get('/', userController.index)

// Blog detail
router.get('/blog_detail/:id/:slug', userController.blog_detail)

// Author profile
router.get('/author_profile/:id/:slug', userController.get_author_profile)
router.post('/author_profile/:id/:slug', isAuth, userController.post_author_profile) // Send Mail

// Author application
router.get('/author_application', isAuth, userController.get_author_application)
router.post('/author_application', isAuth, userController.post_author_application)

// User Settings
router.get('/settings', isAuth, isAuthor, userController.get_settings)
router.post('/settings', imageUplaod.upload.single('photo'), isAuth, isAuthor, userController.post_settings)

// 404
router.get('/404', userController.error)


module.exports = router