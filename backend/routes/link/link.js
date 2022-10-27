const express = require('express')
const router = express.Router()

const {ObjectId} = require('mongodb')

const Doc = require('../../models/doc')
const Link = require('../../models/link')

router.get('/doc/:docId/get', async (req, res) => {
    const userId = ObjectId(req.user.id)
    const docId = ObjectId(req.params.docId)

    const pipeline = [
        {$match: {_id: docId, userId}},
        {$project: {links: 1, _id: 0}},
        {$unwind: "$links"},
        {$lookup: {
            from: "links",
            localField: "links",
            foreignField: "_id",
            as: "link"
        }},
        {$unwind: "$link"},
        {$project: {"link.url": 1, "link.title": 1, "link.updatedAt": 1, "link.tags": 1, "link._id": 1}}
    ]

    try {
        const result = await Doc.aggregate(pipeline)
        res.status(200).json({links: result})
    } catch (err) {
        return res.sendStatus(400)
    }
})

router.post('/doc/:docId/create', (req, res) => {
    const userId = ObjectId(req.user.id)
    const docId = ObjectId(req.params.docId)
    let {title, url, tags} = req.body

    tags = tags.map(tag => ObjectId(tag))

    try {
        const link = new Link({title, url, tags, userId, docId})
        link.save(async (err, data) => {
            if (err) return res.sendStatus(404)

            await Doc.findByIdAndUpdate(
                {_id: docId, userId},
                {$push: {"links": data._id}}
            )
        })
    } catch (err) {
        return res.sendStatus(400)
    }

    res.sendStatus(200)
})

router.post('/doc/:docId/update', async (req, res) => {
    const userId = ObjectId(req.user.id)
    const docId = ObjectId(req.params.docId)
    let {title, url, tags, id} = req.body

    const linkId = ObjectId(id);
    tags = tags.map(tag => ObjectId(tag))

    try {
        await Link.findByIdAndUpdate(
            {_id: linkId, userId, docId},
            {title, url, $addToSet: {"tags": {$each: tags}}}
        )
    } catch (err) {
        return res.sendStatus(400)
    }
    res.sendStatus(200)
})

router.post('/doc/:docId/delete', async (req, res) => {
    const userId = ObjectId(req.user.id)
    const docId = ObjectId(req.params.docId)
    const linkId = ObjectId(req.body.id)

    try {
        await Doc.findByIdAndUpdate(
            {_id: docId, userId},
            {$pull: {links: linkId}}
        )
        await Link.deleteOne({_id: linkId, userId, docId})
    } catch (error) {
        return res.sendStatus(400)
    }
    res.sendStatus(200)
})

module.exports = router