const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const middleWare = require('./utils/middleware')

// connect to MongoDB 
mongoose.connect(config.MONGODB_URI, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false, 
	useCreateIndex: true 
})

// enable CORS
app.use(cors())

app.use(express.json())
app.use(middleWare.tokenExtractor) // such middleware (that updates the requests, should be before routers usage)

// use router controllers
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

// middleware
app.use(middleWare.errorHandler)

module.exports = app 