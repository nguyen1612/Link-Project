const cors = require('cors')
const helmet = require('helmet')
const express = require('express')

// // 
// const Doc = require('../models/doc')
// const Group = require('../models/group')
// const Link = require('../models/link')

// Router
const userRoute = require('../routes/user')
const dataRoute = require('../routes/data')
const fileRoute = require('../routes/file')

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet());

app.use('/users', userRoute)
app.use('/data', dataRoute)
app.use('/file', fileRoute)

// const topics = {name: "Nguyen"}

module.exports = app

