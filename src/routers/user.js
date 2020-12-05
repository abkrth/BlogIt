const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require("../middleware/auth");
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
    //const user = new User(req.body);
	try {
        await user.save();
        const token = await user.generateAuthToken()
        //sendWelcomeEmail(user.email, user.name)
        res.cookie('email', user.email, { httpOnly: true});
        res.cookie('token', token, { httpOnly: true})
        res.redirect('/')
	} catch (e) {
		//console.log(e);
		res.status(400).send(e);
	}
    // if(!user)   {
    //     res.status(404).send()
    // }
    // else    {
    //     await user.save()
    //     const token = await user.generateAuthToken()
    //     res.cookie('email', user.email, { httpOnly: true});
    //     res.cookie('token', token, { httpOnly: true})
    //     res.redirect('./home')
    // }
    
})

router.get('/users/login', (req, res) => {
    console.log("login page")
    res.render('login')
})

router.post('/users/login', async (req, res) => {
    console.log(req.body)
    try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
        );
		const token = await user.generateAuthToken();
        //res.cookie('jwt', token, { httpOnly: true });
        res.cookie('email', user.email, { httpOnly: true});
        res.cookie('token', token, { httpOnly: true})
        console.log('..........login to home...........')
		res.redirect('../')
	} catch (e) {
		console.log(e);
		res.status(400).send();
	}
})

router.post('/users/logout', auth, (req, res) => {
    res.clearCookie('token')
    res.clearCookie('email')
    res.redirect('/')
})

router.get('/users/profile', auth, (req, res) => {
    const user = req.user
    console.log(req.user)
    res.render('profile', {
        user
    });
})

module.exports = router