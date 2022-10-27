const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const Character = new Schema({
    name: {
        type: String,
        max: 20,
        require: true
    },
    description: {
        type: String,
        max: 70,
        require: true
    },
    imageId: {
        type: ObjectId,
        require: true,
    },
    userId: {
        type: ObjectId,
        require: true
    }
})

module.exports = mongoose.model('character', Character)