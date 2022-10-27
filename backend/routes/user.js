const express = require('express')
const router = express.Router()

const User = require('../models/user')

const auth = require('./logic/helper')

router.use(auth)
router.use(express.json())

router.get('/:id', (req, res) => {
    res.status(200).send('success')
})

router.post('/create/tag', async (req, res) => {

    const body = req.body

    await User.findByIdAndUpdate(req.user.id, 
        { $addToSet: {tags: body.tags} }
    )

    // console.log(result)
    res.status(200).json({msg: "hello"})
})

module.exports = router