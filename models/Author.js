const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    name: {
        type: String
    },
    photo: {
        type: String,
        default: 'pp.jpg'
    },
    email: {
        type: String,
    },
    slug: {
        type: String
    },
    onay: {
        type: Boolean,
        default: 0
    },
    description: {
        type: String,
        default: 'Yok'
    },
    dataCreated: {
        type: Date,
        default: Date.now,
    },
})
const Author = mongoose.model("Author", AuthorSchema);
module.exports = Author