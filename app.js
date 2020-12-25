const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const router = require('./controllers/blog')

mongoose.connect(config.MONGODB_URI, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false, 
	useCreateIndex: true 
})

app.use(cors())
app.use(express.json())
app.use('/api/blogs', router)

module.exports = app 