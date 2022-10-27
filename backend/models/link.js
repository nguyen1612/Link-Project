const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId;

const LinkSchema = new Schema({
    url: {
        type: String,
        require: true,
        max: 500
    },
    title: {
        type: String,
        max: 150
    },

    tags: [{
        type: mongoose.Types.ObjectId,
        default: [],
        ref: 'Tags'
    }],

    docId: {
        type: ObjectId,
        required: true
    },

    userId: {
        type: ObjectId,
        required: true
    }
}, {timestamps:true})

module.exports = mongoose.model('link', LinkSchema)