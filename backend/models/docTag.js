const mongoose = require('mongoose')

const schema = mongoose.Schema
const ObjectId = schema.ObjectId
const docTag = new schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
    },
    userId: {
        type: ObjectId
    }
    // docId: mongoose.Types.ObjectId
})

module.exports = mongoose.model('doctag', docTag)