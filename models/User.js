const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    slug: String,
    photo: {
        type: String,
        default: 'pp.jpg'
    },
    authorApplication: {
        type: Boolean,
        default: 0
    },
    authorApplicationMessage: {
        type: String,
        default:''
    },
    telephone: {
        type: String,
        default: '0500 555 55 55'
    },
    adress: {
        type: String,
        default:
            'Keas 69 Str. 15234, Chalandri Athens, Greece'

    },
    about: {
        type: String,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    },
    suspend:{
        type:Boolean,
        default:false
    },
    dataCreated: {
        type: Date,
        default: Date.now,

    },
})
UserSchema.virtual('formattedDataCreated').get(function () {
    return this.dataCreated.toLocaleDateString('tr-TR');
});
const User = mongoose.model("User", UserSchema);
module.exports = User