const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
	const auth = request.get('authorization')
	if (auth && auth.toLowerCase().startsWith('bearer ')) {
		return auth.substring(7)
	}
	return null
}

router.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', {
		username: 1, name: 1
	})
	response.json(blogs)
  })
  
router.post('/', async (request, response, next) => {
	const body = request.body
	const token = getTokenFrom(request)
	let decodedToken = ''
	try {
		decodedToken = jwt.verify(token, process.env.SECRET)
	} catch (e) {
		next(e)
	}
	if (!token || !decodedToken.id) {
		return response.status(401).json({
			error: 'token missing or invalid'
		})
	}

	const user = await User.findById(decodedToken.id)

	if (!body.title) {
		return response.status(400).json({ error: 'missing title' })
	} else if (!body.author) {
		return response.status(400).json({ error: 'missing author' })
	} else if (!body.url) {
		return response.status(400).json({ error: 'missing url' })
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes ? body.likes : 0,
		user: user._id
	})
	
	try {
		const savedBlog = await blog.save()
		user.blogs = user.blogs.concat(savedBlog._id)
		await user.save()
		response.status(201).json(savedBlog)
	} catch (e) {
		next(e)
	}
})

router.get('/:id', async (request, response, next) => {
	try {
		const blog = await Blog.findById(request.params.id)
		if (blog) {
			response.json(blog)
		} else {
			response.status(404).end()
		}
	} catch (error) {
		next(error)
	}
})

router.delete('/:id', async (request, response, next) => {
	try {
		await Blog.findByIdAndRemove(request.params.id)
		response.status(204).end()
	} catch (e) {
		next(e)
	}
})

router.put('/:id', async (request, response, next) => {
	const body = request.body
	const likes = {
		likes: body.likes
	}
	try {
		const updated = await Blog.findByIdAndUpdate(request.params.id, likes, { new: true })
		response.json(updated)
	} catch (e) {
		next(e)
	}
})

module.exports = router