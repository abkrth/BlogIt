const express = require('express')
const auth = require("../middleware/auth");
const router = new express.Router()

router.get('/home', auth, (req, res) => {
    console.log(req.cookies)
    //console.log(req.cookies.email)
    //res.clearCookie("email");
    //console.log(req.cookies.email)
    //console.log(req.cookies.token)
    res.render('home')
})

module.exports = router