const express = require('express')
const auth = require("../middleware/auth");
const Blog = require('../models/blog')
const User = require('../models/user')
const router = new express.Router()

router.get('/blogs', auth, async (req, res) => {
    console.log(req.cookies)
    //console.log(req.cookies.email)
    //res.clearCookie("email");
    //console.log(req.cookies.email)
    //console.log(req.cookies.token)
    const blogs = await Blog.find({}).populate('owner').exec()
    //console.log(blogs);
    res.render('blogs', {
        blogs
    })
})

router.get('/myblogs', auth, async (req, res) => {
    const blogs = await Blog.find({owner: req.user._id}).populate('owner').exec()
    console.log(blogs)
    res.render('myblogs', {
        blogs
    })
})

router.get('/addblog', auth, (req, res) => {
    // var r = new Date();
    // var date = r.getDay() + '/' + r.getMonth() + '/' + r.getFullYear()
    // console.log(r)
    // console.log(date)
    res.render("addblog");
})

router.post('/addblog', auth, async (req, res) => {
    const blog = new Blog({
        ...req.body,
        owner: req.user._id
    });
    console.log("naya blogs created")
    if(!blog)   {
        res.status(404).send()
    }
    else    {
        // blog.postDate = new Date().toISOString()
        //console.log(blog)
        await blog.save()
        res.redirect('/myblogs')
    }
})

router.get("/blogs/check", auth, async (req, res) => {
    console.log(req.cookies)
    //console.log(req.cookies.email)
    //res.clearCookie("email");
    //console.log(req.cookies.email)
    //console.log(req.cookies.token)
    const blogs = await Blog.find({}).populate('owner').exec()
    //console.log(blogs);
    res.render('blogs', {
        blogs
    })
})

module.exports = router