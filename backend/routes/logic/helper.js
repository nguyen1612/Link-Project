const jwt = require('jsonwebtoken')
const env = require('dotenv')
env.config()

function auth(req, res, next) {
    const authToken = req.headers['authorization'];
    const token = authToken && authToken.split(' ')[1]

    if (!token) return res.sendStatus(401)
    
    jwt.verify(token, process.env.access_token, (err, data) => {      
        if (err) return res.sendStatus(403)
        req.user = data;
        next()
    })
}

module.exports = auth