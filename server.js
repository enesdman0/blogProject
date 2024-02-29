const express = require('express')
const ejs = require('ejs');
const session = require('express-session')
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser')
const DBConnect = require('./data/db')
const dummyData = require('./data/dummyData');
const config = require('./config')
const locals = require('./middlewares/locals')

// Express
const app = express()
// app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'helloo world',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: config.db.url })

}))
app.use(locals)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use('/views', express.static('views'))
app.use('/public', express.static('public'))
app.use('/uploads', express.static('uploads'))

// Routes
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const authorRoutes = require('./routes/author')

// Controllers
const userControllers = require('./controllers/user')
const authControllers = require('./controllers/auth')
const adminControllers = require('./controllers/admin')
const authorControllers = require('./controllers/author');

// Paths
app.use('/', userRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/author', authorRoutes);

// DB
(async () => {
    await DBConnect()

    // RUN ONLY IF YOU WANT TO RESET THE DATABASE
    await dummyData()
})();


const port = 3000
app.listen(port, () => {
    console.log(`Server baslatildi ${port}`)
})