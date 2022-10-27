const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId;
const DocShcema = new Schema({
    links: {
        type: [mongoose.Types.ObjectId],
        max: 10000,
        default: []
    },
    title: {
        type: String,
        max: 100
    },
    others: {
        type: Object
    },
    tags: {
        type: [mongoose.Types.ObjectId],
        default: [],
        max: 100
    },
    avatarId: ObjectId,
    characters: {
        type: [mongoose.Types.ObjectId],
        default: [],
        max: 200
    },
    links: {
        type: [mongoose.Types.ObjectId],
        default: [],
        max: 10000
    },
    linkTags: {
        type: [mongoose.Types.ObjectId],
        default: [],
        max: 500
    },
    userId: {
        type: ObjectId,
        require: true
    }
}, {timestamps:true})

DocShcema.index({title: "text"})

module.exports = mongoose.model('doc', DocShcema)