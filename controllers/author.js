const Blog = require('../models/Blog')
const fs = require('fs')

const slugfield = require('../helpers/slugfield');
const User = require('../models/User');
const Author = require('../models/Author');

// Create Blog
exports.get_create_blog = async (req, res) => {
    const message = req.session.message;
    delete req.session.message
    try {
        res.render('author/create_blog', {
            title: 'Create blog',
            message: message
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.post_create_blog = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)

        const title = req.body.title
        const subtitle = req.body.subtitle
        const description = req.body.description
        const photo = req.file.filename
        await Blog.create({
            title: title,
            subtitle: subtitle,
            photo: photo,
            description: description,
            slug: slugfield(title),
            author: req.session.userId
        })
        res.redirect('/')
    }
    catch (err) {
        const message = req.session.message = {
            text: err.message,
            type: 'error'
        }
        res.render('author/create_blog', {
            title: 'Create blog',
            message: message,
            values: {
                formTitle: req.body.title,
                formSubtitle: req.body.subtitle,
                formDescription: req.body.description,
            }
        })
    }
}

// Blogs
exports.blogs = async (req, res) => {
    const message = req.session.message;
    delete req.session.message
    try {
        const blogs = await Blog.find({ author: req.session.userId })
        res.render('author/blogs', {
            title: 'My blogs',
            message: message,
            blogs: blogs
        })
    }
    catch (err) {
        console.log(err)
    }
}

// Blogs
exports.delete_blog = async (req, res) => {
    const message = req.session.message;
    delete req.session.message
    try {
        const blogId = req.params.blogId
        const blog = await Blog.findById(blogId)
        if (blog.author == req.session.userId) {
            await Blog.findByIdAndDelete(blogId)
            req.session.message = {
                type: 'success',
                text: 'Blog deleted successfully'
            }   
            return res.redirect('/author/blogs')
        }
    }
    catch (err) {
        console.log(err)
    }
}