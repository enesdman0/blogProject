const bcrypt = require('bcrypt')
const User = require('../models/User')
const Role = require('../models/Role')
const sendMail = require('../helpers/send-mail')
const slugfield = require('../helpers/slugfield')
const config = require('../config')

// Register
exports.get_register = async (req, res) => {
    const message = req.session.message
    delete req.session.message

    try {
        res.render('auth/register', {
            title: 'Register',
            message: message
        })
    } catch (err) {
        console.log(err)
    }
}
exports.post_register = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        const cpassword = req.body.cpassword

        const userRole = await Role.findOne({ name: 'User' })
        console.log(userRole)
        const user = await User.findOne({
            email: email
        })
        if (user) {
            req.session.message = {
                type: 'error',
                text: 'An account with this email address already exists.'
            }
            res.redirect('/auth/register')
        } else {
            if (password != cpassword) {
                req.session.message = {
                    type: 'error',
                    text: 'Passwords do not match'
                }
                res.redirect('/auth/register')
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                await User.create({
                    name: name,
                    email: email,
                    slug: slugfield(name),
                    password: hashedPassword,
                    role: userRole._id
                })
                await sendMail.sendMail({
                    from: config.email.from,
                    to: email,
                    subject: `Hello ${name}. This message was sent automatically by Blog`,
                    html: `<p>Your account has been created successfully. You can log in</p><br><br><p><b>We wish you healthy days | Blog Team</b></p>`,
                })
                req.session.message = {
                    type: 'success',
                    text: 'Your account has been created successfully. You can log in'
                }
                res.redirect('/auth/login')
            }
        }
    } catch (err) {
        console.log(err)
    }
}

// Login
exports.get_login = async (req, res) => {
    const message = req.session.message
    delete req.session.message

    try {
        res.render('auth/login', {
            title: 'Login',
            message: message
        })
    }
    catch (err) {
        console.log(err)
    }
}
// Login
exports.post_login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password

        const user = await User.findOne({ email: email }).populate({ path: 'role', model: Role })
        if (!user) {
            req.session.message = {
                type: 'error',
                text: 'No users found for this email.'
            }
            return res.redirect('/auth/login')
        }
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            if (user.suspend == true) {
                req.session.message = {
                    type: 'error',
                    text: 'Your account has been suspended. You cannot login'
                }
                res.redirect('/auth/login')
            } else {
                req.session.roles = user.role.name
                req.session.isAuth = true;
                req.session.name = user.name;
                req.session.email = user.email;
                req.session.telephone = user.telephone;
                req.session.adress = user.adress;
                req.session.photo = user.photo;
                req.session.about = user.about;
                req.session.userId = user._id
                return res.redirect('/')
            }
        } else {
            req.session.message = {
                type: 'error',
                text: 'Password is incorrect, please try again.'
            }
            return res.redirect('/auth/login')
        }

    }
    catch (err) {
        console.log(err)
    }
}

// Login
exports.logout = async (req, res) => {
    try {
        await req.session.destroy();
        res.redirect('/')
    }
    catch (err) {
        console.log(err)
    }
}