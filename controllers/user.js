const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
	const body = request.body

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash
	})

	try {
		const savedUser = await user.save()
		response.status(201).json(savedUser)
	} catch (e) {
		next(e)
	}
})

usersRouter.get('/', async (request, response, next) => {
	const users = await User.find({}).populate('blogs', {
		title: 1, url: 1, likes: 1
	})
	response.json(users)
})

module.exports = usersRouter