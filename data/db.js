const mongoose = require('mongoose')
const config = require('../config')

const connect = () => {
    mongoose.connect(config.db.url, {
        dbName: config.db.dbName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connect database')
    }).catch((err) => {
        console.log(err)
    })
}
module.exports = connect