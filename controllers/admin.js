const Blog = require('../models/Blog')
const User = require('../models/User')
const Role = require('../models/Role')
const sendMail = require('../helpers/send-mail')
const db = require('../data/db')

const config = require('../config')

// Index
exports.index = async (req, res) => {
try{
    const author = await Role.findOne({
        name: 'Author'
    })
    const blogCount = await Blog.countDocuments()
    const userCount = await User.countDocuments()
    const authorCount = await User.find({ role: author }).countDocuments()
    const authorApplicationCount = await User.find({ authorApplication: true }).countDocuments()
    res.render('admin/index', {
        title: 'Admin',
        counts: {
            blog: blogCount,
            user: userCount,
            author: authorCount,
            authorApplication: authorApplicationCount
        }
    })
}
catch(err){
    console.log(err)
}
}

// Blog List
exports.blog_list = async (req, res) => {
    const message = req.session.message
    delete req.session.message
    try {
        const blogs = await Blog.find().populate({ path: 'author', model: User })
        res.render('admin/blog_list', {
            title: 'Blog list',
            blogs: blogs,
            message: message
        })
    }
    catch (err) {
        console.log(err)
    }
}

// User List
exports.user_list = async (req, res) => {
    const message = req.session.message
    delete req.session.message
    try {
        const users = await User.find()
        res.render('admin/user_list', {
            title: 'User list',
            users: users,
            message: message
        })
    }
    catch (err) {
        console.log(err)
    }
}

// Delete user
exports.delete_user = async (req, res) => {
    const userId = req.params.userId
    try {
        await User.findByIdAndDelete(userId)
        req.session.message = {
            type: 'success',
            text: 'User successfully delete'
        }
        res.redirect('/admin/user_list')
    }
    catch (err) {
        console.log(err)
    }
}

// Suspend user
exports.suspend_user = async (req, res) => {
    const userId = req.params.userId
    try {
        const user = User.findById(userId)
        await User.findByIdAndUpdate(userId, { suspend: true })
        req.session.message = {
            type: 'success',
            text: 'User successfully suspend'
        }
        res.redirect('/admin/user_list')
    }
    catch (err) {
        console.log(err)
    }
}
// Remove suspend user
exports.remove_suspend_user = async (req, res) => {
    const userId = req.params.userId
    try {
        const user = User.findById(userId)
        await User.findByIdAndUpdate(userId, { suspend: false })
        req.session.message = {
            type: 'success',
            text: 'User successfully remove suspend'
        }
        res.redirect('/admin/user_list')
    }
    catch (err) {
        console.log(err)
    }
}
// Send mail user
exports.get_sendmail_user = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        res.render('admin/send-mail', {
            title: `Send message to ${user.name}`
        }
        )
    }
    catch (err) {
        console.log(err)
    }
}
exports.post_sendmail_user = async (req, res) => {
    try {
        const subject = req.body.subject;
        const description = req.body.description

        const user = await User.findById(req.params.userId)
        await sendMail.sendMail({
            from: config.email.from,
            to: user.email,
            subject: `${subject} | Message from Blog Admin`,
            html: `<p>Hello ${user.name}. This message was sent by a Blog Admin;</p><br><p>${description}</p><br><br><p><b>We wish you healthy days | Blog Team | ${req.session.name}</b></p>`,
        })
        req.session.message = {
            type: 'success',
            text: 'Message sent successfully'
        }
        res.redirect('/admin/user_list')
    }
    catch (err) {
        console.log(err)
    }
}
// Author List
exports.author_list = async (req, res) => {
    const author = await Role.find({
        name: 'Author'
    })
    const authors = await User.find({
        role: author
    })
    res.render('admin/author_list', {
        title: 'Author list',
        authors: authors
    })
}

// Author Application List
exports.author_application_list = async (req, res) => {
    const users = await User.find({
        authorApplication: 1
    })
    res.render('admin/author_application_list', {
        title: 'Author list',
        users: users
    })
}
// Delete blog
exports.delete_blog = async (req, res) => {
    const id = req.params.blogid
    try {
        await Blog.findByIdAndDelete(id)
        req.session.message = {
            type: 'success',
            text: 'Blog successfully delete'
        }
        res.redirect('/admin/blog_list')
    }
    catch (err) {
        console.log(err)
    }
}
// Suspend blog
exports.suspend_blog = async (req, res) => {
    const blogid = req.params.blogid
    try {
        await Blog.findByIdAndUpdate(blogid, { suspend: 1 })
        req.session.message = {
            type: 'success',
            text: 'Blog successfully suspended'
        }
        res.redirect('/admin/blog_list')
    }
    catch (err) {
        console.log(err)
    }
}
// Remove suspend blog
exports.remove_suspend_blog = async (req, res) => {
    const blogid = req.params.blogid
    try {
        await Blog.findByIdAndUpdate(blogid, { suspend: 0 })
        req.session.message = {
            type: 'success',
            text: 'Blog successfully remove suspended'
        }
        res.redirect('/admin/blog_list')
    }
    catch (err) {
        console.log(err)
    }
}

exports.author_application_approve = async (req, res) => {
    try {
        const authorRole = await Role.findOne({ name: 'Author' })
        const user = await User.findByIdAndUpdate(req.params.userId, { role: authorRole, authorApplication: false })
        await sendMail.sendMail({
            from: config.email.from,
            to: user.email,
            subject: `Acceptance | Message from Blog`,
            html: `<p>Hello ${user.name}. This message was sent by a Blog Admin;</p><br><p>Congratulations. Your request has been reviewed and the author role has been deemed suitable for you. Authorization increase procedures have been completed. You can share your blog posts by logging into your account. Welcome to the club.</p><br><br><p><b>We wish you healthy days | Blog Team</b></p>`,
        })
        res.redirect('/admin/author_application_list')
    }
    catch (err) {
        console.log(err)
    }
}
exports.author_application_disapprove = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { authorApplication: false })
        await sendMail.sendMail({
            from: config.email.from,
            to: user.email,
            subject: `Disacceptance | Message from Blog`,
            html: `<p>Hello ${user.name}. This message was sent by a Blog Admin;</p><br><p>We are sad. Unfortunately, your authorship was not accepted by our board. Please try again when you feel satisfied. Thank you for your interest</p><br><br><p><b>We wish you healthy days | Blog Team</b></p>`,
        })
        res.redirect('/admin/author_application_list')
    }
    catch (err) {
        console.log(err)
    }
}