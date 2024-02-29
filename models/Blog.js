const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        minLength: [10, 'Title must be longer than 10 characters'],
        maxLength: [45, 'Title must be less than 45 characters']
    },
    subtitle: {
        type: String,
        minLength: [50, 'Subtitle must be longer than 50 characters'],
        maxLength: [350, 'Subtitle must be less than 300 characters'],
    },
    description: {
        type: String,
        minLength: [50, 'Description must be less than 50 characters'],
    },
    photo: {
        type: String
    },
    slug: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'authors',
    },
    view: {
        type: Number,
        default: 0
    },
    like: {
        type: Number,
        default: 0
    },
    suspend: {
        type: Boolean,
        default: false
    },
    dataCreated: {
        type: Date,
        default: Date.now,
    },
})
const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog