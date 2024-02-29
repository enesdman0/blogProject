const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin')
const isAdmin = require('../middlewares/isAdmin')

// Index
router.get('/', isAdmin, adminController.index)

// Blog List
router.get('/blog_list', isAdmin, adminController.blog_list)

// Delete blog
router.get('/delete_blog/:blogid', isAdmin, adminController.delete_blog)

// Suspend blog
router.get('/suspend_blog/:blogid', isAdmin, adminController.suspend_blog)
router.get('/remove_suspend_blog/:blogid', isAdmin, adminController.remove_suspend_blog)

// User List
router.get('/user_list', isAdmin, adminController.user_list)

// Delete user
router.get('/delete_user/:userId', isAdmin, adminController.delete_user)

// Suspend user
router.get('/suspend_user/:userId', isAdmin, adminController.suspend_user)
router.get('/remove_suspend_user/:userId', isAdmin, adminController.remove_suspend_user)

// Send mail user
router.get('/send-mail_user/:userId', isAdmin, adminController.get_sendmail_user)
router.post('/send-mail_user/:userId', isAdmin, adminController.post_sendmail_user)

// Author List
router.get('/author_list', isAdmin, adminController.author_list)

// Author Application List
router.get('/author_application_list', isAdmin, adminController.author_application_list)

router.get('/author_application_approve/:userId', isAdmin, adminController.author_application_approve)
router.get('/author_application_disapprove/:userId', isAdmin, adminController.author_application_disapprove)


module.exports = router