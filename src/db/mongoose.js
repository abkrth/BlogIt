const mongoose = require('mongoose')

const MONGODB_URL = "mongodb://127.0.0.1:27017/blog"
mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})