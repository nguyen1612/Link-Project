const mongoose = require('mongoose')
const server =  require('./server/server.js')
const serverAuth = require('./server/authServer')

const multer = require("multer");
const fs = require('fs')

mongoose.connect('mongodb://localhost:27017/link_management')
        .then(() => {
            server.listen(5000, () => {
                console.log("Server running on port: 5000")
            })
            
            serverAuth.listen(5500, () => {
                console.log("Sever Authentication is running on port: 5500")
            })
        })




