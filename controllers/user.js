const Blog = require('../models/Blog')
const User = require('../models/User')
const Author = require('../models/Author')
const Role = require('../models/Role')
const config = require('../config')

const sendMail = require('../helpers/send-mail')
// Index
exports.index = async (req, res) => {
    const blogs = await Blog.find({ suspend: false }).populate({ path: 'author', model: User })
    res.render('user/index', {
        title: 'Blog',
        blogs: blogs,
    })
}

// Blog detail
exports.blog_detail = async (req, res) => {
    const id = req.params.id
    const blog = await Blog.findById(id).populate({ path: 'author', model: User })
    if (!blog.suspend) {
        blog.view += 1
        blog.save()
        return res.render('user/blog_detail', {
            title: 'Blog detail',
            blog: blog
        })
    }
    req.session.message = {
        type: 'warning',
        text: 'The link you are trying to reach is incorrect.',
    }
    res.redirect('/404')
}

// Author profile
exports.get_author_profile = async (req, res) => {
    const message = req.session.message
    delete req.session.message
    const id = req.params.id
    const slug = req.params.slug
    try {
        const author = await User.findById(id)
        const blogs = await Blog.find({ author: req.params.id, suspend: false })
        res.render('user/author_profile', {
            title: author.name,
            author: author,
            blogs: blogs,
            message: message
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.post_author_profile = async (req, res) => { // Send Mail
    const id = req.params.id
    try {
        const subject = req.body.subject
        const message = req.body.message
        const author = await User.findById(id)
        await sendMail.sendMail({
            from: config.email.from,
            to: author.email,
            subject: `${subject} | Message from your reader`,
            html: `<p>Hello ${author.name}. This message was sent by a reader using your Blog profile;</p><br><p>${message}</p><br><p>User e-mail: ${req.session.email}</p><br><p><b>We wish you healthy days | Blog Team</b></p>`,
        })
        req.session.message = {
            type: 'success',
            text: 'Your message has been sent successfully'
        }
        res.redirect(`/author_profile/${author._id}/${author.slug}`)
    }
    catch (err) {
        console.log(err)
    }
}

// Author Application
exports.get_settings = async (req, res) => {
    const message = req.session.message
    delete req.session.message
    try {
        const userId = req.session.userId
        const user = await User.findById(userId)
        res.render('user/settings', {
            title: 'Settings',
            user: user,
            message: message
        })
    }
    catch (err) {
        console.log(err)
    }
}
exports.post_settings = async (req, res) => {
    try {
        const email = req.body.email
        const telephone = req.body.telephone
        const adress = req.body.adress
        const about = req.body.about
        let photo = req.body.photo
        if (req.file) {
            photo = req.file.filename
        }
        console.log(req.body)
        await User.findByIdAndUpdate(req.session.userId, {
            email: email,
            telephone: telephone,
            adress: adress,
            about: about,
            photo: photo
        })
        req.session.message = {
            type: 'success',
            text: 'Your profile info successfully update'
        }
        req.session.email = email;
        req.session.telephone = telephone;
        req.session.adress = adress;
        req.session.about = about;
        res.redirect('/settings')
    }
    catch (err) {
        console.log(err)
    }
}

// Settings
exports.get_author_application = async (req, res) => {
    const message = req.session.message
    delete req.session.message
    try {
        const userId = req.session.userId
        const user = await User.findById(userId)
        res.render('user/author_application', {
            title: 'Author application',
            user: user,
            message: message
        })
    }
    catch (err) {
        console.log(err)
    }
}
exports.post_author_application = async (req, res) => {
    try {
        const description = req.body.description
        const user = await User.findByIdAndUpdate(req.session.userId, { authorApplicationMessage: description, authorApplication: true })
        req.session.message = {
            type: 'success',
            text: 'Your writing application has been successfully accepted. You will be notified via email with acceptance or red status.'
        }
        res.redirect('/author_application')
    }
    catch (err) {
        console.log(err)
    }
}

// 404
exports.error = async (req, res) => {
    const message = req.session.message
    delete req.session.message
    try {
        res.render('user/404', {
            title: 'Error',
            message: message
        })
    }
    catch (err) {
        console.log(err)
    }
}