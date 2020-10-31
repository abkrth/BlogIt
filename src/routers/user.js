const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const router = new express.Router()

//console.log(User)
const temp = {
    email: 'abc@gmail.com',
    password: 'abc123'
}
// const user = new User(temp)
// user.save()
// console.log(user)
router.get('/users', (req, res) => {
    res.render('register')
})

router.post('/users', async (req, res) => {
    //console.log(req.body)
    const user = new User(req.body)
    if(!user)   {
        res.status(404).send()
    }
    else    {
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('email', user.email, { httpOnly: true});
        res.cookie('token', token, { httpOnly: true})
        res.redirect('./home')
    }
})

router.get('/users/login', (req, res) => {
    res.render('login')
})

router.post('/users/logout', (req, res) => {
    res.clearCookie('token')
    res.clearCookie('email')
    res.redirect('/')
})

module.exports = router