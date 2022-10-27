const express = require('express')
const cors = require('cors')

const Doc = require('../models/doc')
const Tag = require('../models/tag')
const DocTag = require('../models/docTag')
const mongoose = require('mongoose')

const router = express.Router()

const auth = require('./logic/helper');
const tagRoute = require('./tag/tag')
const linkRoute = require('./link/link');
const { ObjectId } = require('mongodb');
const Link = require('../models/link')


router.use(cors());
router.use(express.json())
router.use(auth)


router.use('/tag', tagRoute)
router.use('/link', linkRoute)


// Doc
router.get('/get/doc/:id', async (req, res) => {
    let userId = req.user.id
    const {id} = req.params

    const ObjectId = mongoose.Types.ObjectId(id);
    userId = mongoose.Types.ObjectId(userId);

    let pipeline = [
        {$match: {_id: ObjectId, userId: userId}}, 
        {$lookup: {from: "doctags", localField: "tags", foreignField: "_id", as: "tags"}},
        {$project: {"createdAt": 0, "userId": 0, "tags.docId": 0, "tags.__v": 0}}
    ]

    const doc = Doc.aggregate(pipeline)
    
    if (!doc) res.sendStatus(404)
    
    const result = []
    let i = 0
    for await (const row of doc) {
        result[i] = row
        i++;
    }

    if(result.length > 1)
        return res.sendStatus(400)

    // const tag = await Tag.find({docId: id, userId})

    res.status(200).json(result[0])
})

// Get many documents (Apply Pagination)
router.post('/get/docs', async (req, res) => {
    const body = req.body
    // 
    const pageSize = body.pageSize
    let pageNum = body.pageNum
    const sortDate = body.sortDate
    const searchTitle = body.searchTitle

    const id = req.user.id
    const ObjectId = mongoose.Types.ObjectId(id);

    if (pageNum < 0) {
        pageNum = 1
    }

    const query = searchTitle.length > 0 ? {$text: {$search: searchTitle}} : {userId: ObjectId}  
    // console.log(query, {title: 1, tags: 1, id: "$_id"})
    const docs = await Doc.find(query, {title: 1, tags: 1, id: "$_id"})
                          .sort({updatedAt: sortDate ? -1 : 1})
                          .skip((+pageNum - 1) * pageSize)
                          .limit(pageSize)
    const count = await Doc.find({userId: ObjectId}).count()
    
    res.status(200).json({docs, total: count})
})

// Create a document
router.post('/doc/create', async (req, res) => {
    const userId = ObjectId(req.user.id)
    let {title, others, oldTags, newTags} = req.body

    newTags = newTags.map(tag => ({userId, ...tag}))

    try {
        const new_len = newTags.length;
        const old_len = oldTags.length;
        const total = new_len + old_len

        let tagIds = [...new Array(total)]
        for (let i = 0 ; i < old_len; i++)
            tagIds[i] = ObjectId(oldTags[i].id)

        if (newTags.length > 0) {
            DocTag.insertMany(newTags, async (err, data) => {
                if (err) return res.sendStatus(400);

                let count = 0;
                for (let i = old_len; i < total; i++, count++)
                    tagIds[i] = data[count]._id

                const doc = new Doc({
                    title, tags: tagIds, others: others ? others : {}, userId
                })

                await doc.save()
                return res.sendStatus(200)
            })
        } else {

        }
    } catch (error) {
        return res.sendStatus(400)
    }
})

// Create document tags
router.post('/doc/create/tag', async (req, res) => {
    const userId = ObjectId(req.user.id)
    const {name, description} = req.body

    try {
        const docTag = new DocTag({
            name, description, userId
        })
        await docTag.save()
    } catch (error) {
        // console.log(error)
        return res.sendStatus(400)
    }

    res.sendStatus(200)
})

// Get document tags
router.get('/doc/get/tag', async (req, res) => {
    const userId = ObjectId(req.user.id)

    try {
        const tags = await DocTag.find({userId})
        return res.status(200).json(tags)
    } catch (error) {
        return res.sendStatus(400)
    }
})


router.get('/doc/:docId/deleteAll', async (req, res) => {
    const userId = ObjectId(req.user.id)
    const docId = ObjectId(req.params.docId)

    try {
        await Doc.findByIdAndDelete({_id: docId, userId})
        await Link.deleteMany({docId, userId})
        await Tag.deleteMany({docId, userId})
    } catch (error) {
        return res.sendStatus(400)
    }

    res.sendStatus(200)
})


module.exports = router