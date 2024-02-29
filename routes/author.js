const express = require('express')
const router = express.Router()

const imageUplaod = require('../helpers/image-upload')

const authorController = require('../controllers/author')

const isAuthor = require('../middlewares/isAuthor')

// Create Blog
router.get('/create_blog', isAuthor, authorController.get_create_blog)
router.post('/create_blog', isAuthor, imageUplaod.upload.single('photo'), authorController.post_create_blog)

// Blogs
router.get('/blogs', isAuthor, authorController.blogs)

// Delete blog
router.get('/delete_blog/:blogId', isAuthor, authorController.delete_blog)


module.exports = router