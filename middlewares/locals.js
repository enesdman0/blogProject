module.exports = (req, res, next) => {
    res.locals.isAuth = req.session.isAuth;
    res.locals.userId = req.session.userId;
    res.locals.name = req.session.name;
    res.locals.email = req.session.email;
    res.locals.telephone = req.session.telephone;
    res.locals.adress = req.session.adress;
    res.locals.photo = req.session.photo;
    res.locals.about = req.session.about;
    res.locals.isAuthor = req.session.roles ? req.session.roles.includes("Author") : false;
    res.locals.isAdmin = req.session.roles ? req.session.roles.includes("Admin") : false;

    next()
}