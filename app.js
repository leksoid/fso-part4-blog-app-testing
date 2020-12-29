const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/users')
const middleWare = require('./utils/middleware')

mongoose.connect(config.MONGODB_URI, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false, 
	useCreateIndex: true 
})

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use(middleWare.errorHandler)

module.exports = app 