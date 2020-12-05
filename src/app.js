const express = require('express')
const hbs = require('hbs')
const path = require('path')
const userRouter = require("./routers/user")
const blogRouter = require("./routers/blog")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const Blog = require('./models/blog')

const PORT = process.env.PORT || 3000

const app = express()
require('./db/mongoose') // connects to database

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


app.use(express.static(publicDirectoryPath))
app.use(cookieParser())

// to use and parse req.body
app.use(bodyParser.urlencoded({ extended: true })); 

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.json())

// ***** ROUTES *****
app.use(userRouter)
app.use(blogRouter)

// app.use('/', (req, res) => {
//     res.render('index')
// })

app.get('/', async (req, res) => {
    // console.log(req.cookies)
    //console.log(req.cookies.email)
    //res.clearCookie("email");
    //console.log(req.cookies.email)
    //console.log(req.cookies.token)
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, "thakursaab")
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})
        if(!user)   {
            console.log('fuck no user')
        }
        if(!token || !user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        const blogs = await Blog.find({}).populate('owner').exec()
        res.render('blogs', {
            blogs
        })
    } catch (e) {
        res.render('index')
    }
})

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})