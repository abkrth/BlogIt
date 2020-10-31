const express = require('express')
const hbs = require('hbs')
const path = require('path')
const userRouter = require("./routers/user")
const blogRouter = require("./routers/blog")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3000

const app = express()
require('./db/mongoose') // connects to database

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


app.use(express.static(publicDirectoryPath))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true })); 
// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.json())

// ***** ROUTES *****
app.use(userRouter)
app.use(blogRouter)

app.use('/', (req, res) => {
    res.render('index')
})


app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})