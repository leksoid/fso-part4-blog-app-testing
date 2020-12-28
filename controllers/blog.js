const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
  })
  
router.post('/', async (request, response, next) => {
	const body = request.body

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
		likes: body.likes ? body.likes : 0
	})
	
	try {
		const savedBlog = await blog.save()
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