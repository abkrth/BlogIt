const express = require('express')
const auth = require("../middleware/auth");
const Blog = require('../models/blog')
const User = require('../models/user')
let _ = require('lodash')
const router = new express.Router()

router.get('/blogs', auth, async (req, res) => {
    console.log(req.cookies)
    //console.log(req.cookies.email)
    //res.clearCookie("email");
    //console.log(req.cookies.email)
    //console.log(req.cookies.token)
    var blogs = await Blog.find({}).populate('owner').exec();
    blogs = _.orderBy(blogs, ['createdAt'], ['desc']);
    res.render('blogs', {
        blogs
    })
})

router.get('/blogs/:id',auth, async (req, res) => {
    const _id = req.params.id
    try {
        const blog = await Blog.findOne({ _id }).populate('owner').exec()
        if(!blog)   {
            res.status(404).send()
        }
        // console.log(blog)
        // console.log(req.user)
        let flag = blog.owner._id.equals(req.user._id)
        // console.log(flag)
        res.render('blog', {
            blog,
            flag
        })
    } catch(e)  {
        res.status(500).send()
    }
})

router.get('/blogs/:id/edit', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const blog = await Blog.findOne({ _id }).populate('owner').exec()
        // console.log(blog)
        if(!blog)   {
            res.status(404).send()
        }
        let flag = blog.owner._id.equals(req.user._id)
        if(!flag)   {
            res.status(403).send()
        }
        res.render('editblog', {
            blog
        })
    }   catch (e) {
        res.status(500).send()
    }
})

router.patch('/blogs/:id/edit', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const blog = await Blog.findOne({ _id }).populate('owner').exec()
        // console.log(blog)
        if(!blog)   {
            res.status(404).send()
        }
        let flag = blog.owner._id.equals(req.user._id)
        if(!flag)   {
            res.status(403).send()
        }
        blog.title = req.body.title
        blog.body = req.body.body
        await blog.save();
        res.redirect('/myblogs')
    }   catch (e) {
        res.status(500).send()
    }
})

router.delete('/blogs/:id/delete', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const blog = await Blog.findOne({ _id }).populate('owner').exec()
        // console.log(blog)
        if(!blog)   {
            res.status(404).send()
        }
        let flag = blog.owner._id.equals(req.user._id)
        if(!flag)   {
            res.status(403).send()
        }
        await Blog.deleteOne({_id})
        res.redirect('/myblogs')
    }   catch (e) {
        res.status(500).send()
    }
})

router.get('/myblogs', auth, async (req, res) => {
    var blogs = await Blog.find({owner: req.user._id}).populate('owner').exec()
    blogs = _.orderBy(blogs, ['createdAt'], ['desc']);
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
        createdAt: new Date(),
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