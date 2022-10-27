const jwt = require('jsonwebtoken')
const env = require('dotenv')
const express = require('express')
const cors = require('cors')
const User = require("../models/user");
const bcrypt = require('bcrypt')

const app = express()
env.config()

app.use(cors());
app.use(express.json())

let refresh_tokens = []

app.post('/token', (req, res) => {
    const refresh_token = req.body.token
    if (refresh_token === null) res.sendStatus(401)
    if (!refresh_tokens.includes(refresh_token)) return res.sendStatus(403)
    jwt.verify(refresh_token, process.env.refresh_token, (err, user) => {
        if (err) res.sendStatus(403)
        const access_token = generateToken({username: user.username})
        return res.json({access_token})
    })

    return res.sendStatus(400)
})

app.delete('/logout', (req, res) => {
    refresh_tokens = refresh_tokens.filter(token => token !== req.body.token)
    return res.sendStatus(200)
})

app.post('/login', async (req, res) => {
    try {
        const data = req.body
        const result = await User.findOne({username: data.username})
        if (!result) return res.status(400).send('invalid username')
        
        const isValid = await bcrypt.compare(data.password, result.password);
        if(isValid) {
            const access_token = generateToken({...data, id: result._id})
            const refresh_token = jwt.sign(data, process.env.refresh_token)
            refresh_tokens.push(refresh_token)
            return res.status(200).json({access_token, refresh_token})
        }
    } catch (err) {
        console.log(err)
    } 
    return res.sendStatus(400)
})

app.post('/signup', async (req, res) => {
    const data = req.body
    
    const user = {email: data.email, username: data.username}
    try {
        // Database check
        let result = await User.findOne({email: user.email})
        if (result) return res.status(400).send('email existed')
        
        result = await User.findOne({username: user.username})
        if (result) return res.status(400).send('username existed')

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password1, salt);
        
        // Add user to database
        const newUser = new User({
            username: data.username,
            email: data.email,
            password: hashedPassword,
        })
        await newUser.save();

        // Generate token
        delete data.password1
        delete data.password2
        const access_token = generateToken({...data, id: newUser._id.toString()})
        const refresh_token = jwt.sign(data, process.env.refresh_token)
        refresh_tokens.push(refresh_token)

        return res.status(200).json({access_token, refresh_token})
    } catch (err) {
        console.log(err)
    } 

    return res.sendStatus(400)
})

app.post('/checkEmail', async (req, res) => {
    try {
        const data = req.body
        const result = await User.findOne({email: data.email})
        if (result) return res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }

    return res.sendStatus(400)
})

app.post('/checkUsername', async (req, res) => {
    try {
        const data = req.body
        const result = await User.findOne({username: data.username})
        if (result) return res.sendStatus(200)
    } catch (err) {
        console.log(err)
    }

    return res.sendStatus(400)
})

function generateToken(user) {
    return jwt.sign(user, process.env.access_token, {expiresIn: '5h'})
}

module.exports = app