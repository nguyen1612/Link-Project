const mongoose = require('mongoose')

const schema = mongoose.Schema
const ObjectId = schema.ObjectId
const tag = new schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    userId: mongoose.Types.ObjectId,
    docId: mongoose.Types.ObjectId
})

module.exports = mongoose.model('tag', tag)