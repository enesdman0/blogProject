module.exports = (req, res, next) => {
    if (!req.session.isAuth) {
        return res.redirect("/")
    }
    if (req.session.roles != "Admin") {
        return res.redirect("/")
    }
    next();
}