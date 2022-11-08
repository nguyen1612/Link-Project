const Redis = require('redis');
const express = require('express');
const router = express.Router()

const auth = require('./logic/helper')

const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer( {storage} )


const Doc = require('../models/doc')
const Character = require('../models/character');

const {Readable} = require('stream')
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb')



const uri = 'mongodb://localhost:27017';
const dbName = 'link_management';
const client = new MongoClient(uri);



router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(auth);


const redisClient = Redis.createClient();


client.connect(_ => {
    const db = client.db(dbName);
    var bucket = new GridFSBucket(db);

    router.post('/edit/docAvatar/:docId/:avtId', upload.single('file'), async (req, res) => {
        const {docId, avtId} = req.params;
        const file = req.file
        
        try {
            bucket.delete(ObjectId(avtId))
        } catch(err) {
        }

        const stored = bucket.openUploadStream(file.originalname, {
            metadata: {
                encoding: file.encoding,
                mimetype: file.mimetype,
            }
        })

        Readable.from(req.file.buffer)
                .pipe(stored)
                .on('error', error => {console.log(error)})


        await Doc.findByIdAndUpdate(docId, {avatarId: stored.id})

        res.status(200).json({id: stored.id})
    })

    router.post('/edit/character', upload.single('file'), async (req, res) => {
        const userId = ObjectId(req.user.id)
        // c
        

        res.sendStatus(200)
    })

    router.post('/doc/:docId/add/character', upload.single('file'), async (req, res) => {
        const userId = ObjectId(req.user.id)
        const docId = ObjectId(req.params.docId)
        const file = req.file
        const {name, description} = req.body

        try {
            const stored = bucket.openUploadStream(file.originalname, {
                metadata: {
                    encoding: file.encoding,
                    mimetype: file.mimetype,
                }
            })
    
            const character = new Character({
                name, description, userId, imageId: stored.id
            })
            await character.save();
    
            await Doc.findByIdAndUpdate(
                {_id: docId, userId},
                {$push: {"characters": character._id}}
            )
    
            Readable.from(file.buffer)
                    .pipe(stored)
        } catch (err) {
            console.log(err)
            return res.sendStatus(400)
        }

        res.sendStatus(200) //.json({id: character._id})
    })

    router.post('/doc/:docId/edit/character', upload.single('file'), async(req, res) => {
        const userId = ObjectId(req.user.id)
        const docId = ObjectId(req.params.docId)
        const file = req.file
        const {name, description, id} = req.body
        const charId = ObjectId(id);
        const imageId = ObjectId(req.body.imageId);

        if (file) {
            const stored = bucket.openUploadStream(file.originalname, {
                metadata: {
                    encoding: file.encoding,
                    mimetype: file.mimetype,
                }
            })
            
            try {
                await Character.findOneAndUpdate(
                    {_id: charId, userId}, 
                    {name, description, imageId: stored.id},
                )

                bucket.delete(imageId)
                Readable.from(file.buffer)
                        .pipe(stored)
            } catch(err ) {
                return res.sendStatus(404)
            }
            
        } else {
            await Character.findByIdAndUpdate(charId, {name, description})
        }

        res.sendStatus(200);
    })

    router.post('/doc/:docId/delete/character', async(req, res) => {
        const userId = ObjectId(req.user.id)
        const docId = ObjectId(req.params.docId)
        const charId = ObjectId(req.body.id)

        try {
            await Doc.findByIdAndUpdate(
                {_id: docId, userId},
                {$pull: {"characters": charId}}
            )
            
            const char = await Character.findByIdAndDelete(charId)
            bucket.delete(char.imageId)
        } catch (err) {
            console.log(err)
            res.sendStatus(400)
        }

        res.sendStatus(200)
    })
    




    router.get('/doc/:docId/avatar', async(req, res) => {
        const {docId} = req.params
        const userId = req.user.id

        const doc = await Doc.findOne({_id: docId, userId})
        const cursor = bucket.find({_id: doc.avatarId})

        if (await cursor.hasNext() === false) {
            console.log(doc.avatarId)
            return res.sendStatus(404)
        }
        
        let image_type;
        let count = 0;
        cursor.forEach(doc => {
            if(count == 0) {
                image_type = doc.metadata.mimetype
            }
            count++;
        })
        

        // // Get File from GridFS
        try {
            const stream = bucket.openDownloadStream(doc.avatarId)
            let buffs = []
    
            stream.on('data', chunks => {buffs.push(chunks)})
                  .on('error', err => {console.log(err)})
                  .on('end', () => {
                    buffs = Buffer.concat(buffs)
                    res.json({base64: buffs.toString('base64'), id: doc.avatarId, type: image_type});
                  })  
        } catch(err) {
            res.sendStatus(400)
        }

        // res.sendStatus(200)
    })

    router.get('/doc/:docId/character/:charId', async (req, res) => {
        const userId = ObjectId(req.user.id)
        const docId = ObjectId(req.params.docId)
        const charId = ObjectId(req.params.charId)

        const character = await Character.findOne(
            {_id: charId, userId},
            {name: 1, description: 1, imageId: 1}
        )

        if (!character)
            return res.sendStatus(404)

        const cursor = bucket.find({_id: character.imageId})

        if (await cursor.hasNext() === false) {
            console.log(character.imageId)
            return res.sendStatus(404)
        }
        
        let image_type;
        let count = 0;
        cursor.forEach(doc => {
            if(count == 0) {
                image_type = doc.metadata.mimetype
            }
            count++;
        })
        
        try {
            const stream = bucket.openDownloadStream(character.imageId)
            let buffs = []
            
            stream.on('data', chunk => {buffs.push(chunk)})
                  .on('end', _ => {
                    buffs = Buffer.concat(buffs)
                    return res.json({
                        base64: buffs.toString('base64'), type: image_type, _id: character._id
                    })
                  })
        } catch (err) {
            return res.sendStatus(404);
        }

        // res.sendStatus(200)
    })

    router.get('/doc/:docId/characters/pages/:pageNum', async (req, res) => {

        const userId = ObjectId(req.user.id)
        const docId = ObjectId(req.params.docId)
        const pageNum = parseInt(req.params.pageNum)

        const PAGE_SIZE = 7;

        let result = await Doc.aggregate([
            {$match: {_id: docId, userId}},
            {$addFields: {"imgIds": {$slice: ["$characters", (pageNum - 1) * PAGE_SIZE, PAGE_SIZE]} }},
            {$project: {tmp: "$imgIds", "imgIds": 1, total: {$size: "$characters"}} },
            {$lookup: {
                "from": "characters",
                "localField": "tmp",
                "foreignField": "_id",
                "as": "character"
            }},
            // {$unwind: "$character"},
            {$project: {"characters": 0, "character.userId": 0, "character.__v": 0, "_id": 0}}
        ])

        if (result.length > 1 || result.length <= 0)
            return res.sendStatus(403)
        if (result[0].imgIds.length === 0)
            return res.sendStatus(404)
        
        const total = result[0].total
        delete result[0].total
        result = result[0]

        res.status(200).json({result, total})
    })


    router.get('/dropAll', async (req, res) => {
        bucket.drop();

        res.sendStatus(200)
    })


module.exports = router
