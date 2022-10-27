const express = require('express')
const router = express.Router()

const Tag = require('../../models/tag')
const Doc = require('../../models/doc')
const {ObjectId} = require('mongodb')
const mongoose = require('mongoose')
const Link = require('../../models/link')



router.post('/doc/:docId/create', async (req, res) => {
    const userId = ObjectId(req.user.id)
    const docId = ObjectId(req.params.docId)
    const {name, description} = req.body

    const tag = new Tag({name, description, userId, docId})

    tag.save(async (err, data) => {
        if (err) {
            console.log(tag)
            return res.sendStatus(400)
        }

        await Doc.findByIdAndUpdate(
            {_id: docId, userId},
            {$push: {"linkTags": data._id}}
        )
        
        return res.status(200).json({id: data._id})
    })

})  


router.get('/doc/:docId/get', async (req, res) => {
    const userId = ObjectId(req.user.id)
    const docId = ObjectId(req.params.docId)

    const pipeline = [
        {$match: {_id: docId, userId}},
        {$project: {linkTags: 1, _id: 0}},
        {$unwind: "$linkTags"},
        {$lookup: {
            from: "tags",
            localField: "linkTags",
            foreignField: "_id",
            as: "tag"
        }},
        {$project: {"tag.userId": 0, "tag.__v": 0, "tag.docId": 0, "linkTags": 0}},
        {$unwind: "$tag"}
    ]

    let result;
    try {
        result = await Doc.aggregate(pipeline)
    } catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }

    res.status(200).json(result)
})


router.post('/doc/:docId/update', async (req, res) => {
    const userId = ObjectId(req.user.id)
    const docId = ObjectId(req.params.docId)
    const tagId = ObjectId(req.body.id)
    const {name, description} = req.body

    let updateValue;
    if (name)
        updateValue = {name}
    if (description)
        updateValue = {...updateValue, description}

    try {
        await Tag.findByIdAndUpdate(
            {_id: tagId, userId, docId},
            updateValue
        )
    } catch (err) {
        return res.sendStatus(405)
    }
    


    res.sendStatus(200)
})


router.post('/doc/:docId/delete', async (req, res) => {
    const userId = ObjectId(req.user.id)
    const docId = ObjectId(req.params.docId)
    const tagIds = req.body.ids.map(id => ObjectId(id))
    
    try {
        await Tag.deleteMany({_id: {$in: tagIds}})
        await Doc.findByIdAndUpdate(
            {_id: docId, userId},
            {$pull: {"linkTags": {$in: tagIds}}}
        )
       await Link.updateMany(
            {$pull: {tags: {$in: tagIds}}}
        )
    } catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }

    res.sendStatus(200)
})


module.exports = router