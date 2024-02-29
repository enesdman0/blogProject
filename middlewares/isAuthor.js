module.exports = (req, res, next) => {
    if (!req.session.isAuth) {
        return res.redirect("/")
    }
    if (req.session.roles != 'Admin' && req.session.roles != "Author") {
        return res.redirect("/")
    }
    next();
}

