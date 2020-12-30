const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
	await Blog.deleteMany({})
	// get all mongoose objects
	const blogObj = helper.testData.map(blog => new Blog(blog))
	// make save() call for each ^^ and save promises in array - this is done in parallel
	const promiseArray = blogObj.map(blog => blog.save())
	// wait for all promises to resolve 
	await Promise.all(promiseArray)
})

describe('GET /api/blogs', () => {
	test('blogs are returned as JSON', async ()=> {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('the correct amount of blogs returned', async () => {
		const response = await api.get('/api/blogs')
	
		expect(response.body).toHaveLength(helper.testData.length)
	})

	test('some blog is within the list of returned', async () => {
		const response = await api.get('/api/blogs')

		const contents = response.body.map(e => e.title)
		expect(contents).toContain('Awesome js')
	})

	test('blogs should have ids', async () => {
		const response = await api.get('/api/blogs')
		const ids = response.body.map(e => e.id)

		ids.forEach(e => {
			expect(e).toBeDefined()
		});
	})
})

describe('GET /api/blogs/{id}', () => {
	test('success with 200 when blog exists', async () => {
		const blogs = await helper.getAllBlogsInDb()
		const blogToView = blogs[0]
		const specificBlog = await api
			.get(`/api/blogs/${blogToView.id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)
		const toView = JSON.parse(JSON.stringify(blogToView))
		expect(specificBlog.body).toEqual(toView)
	})

	test('failure with 404 if blog does not exist', async () => {
		const id = await helper.nonExistingId()
		console.log(`Non-existing id used is: ${id}`)
		await api
			.get(`/api/blogs/${id}`)
			.expect(404)
	})
	
	test('failure with 400 when id is invalid', async () => {
		const invalidId = "5aexf6e5e2bc18968f229fpp"
		await api
			.get(`/api/blogs/${invalidId}`)
			.expect(400)
	})
})

describe('POST {body} /api/blogs', () => {
	test('a valid blog entry succeed', async () => {
		const users = await helper.usersInDb()
		const newBlog = {
			title: 'Test Post',
			author: 'Jest',
			url: 'https://somewhere.com',
			likes: 1,
			userId: users[0]._id
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await helper.getAllBlogsInDb()
		expect(response).toHaveLength(helper.testData.length + 1)

		const titles = response.map(e => e.title)
		expect(titles).toContain(newBlog.title)
	})

	test('empty body blog is not saved', async () => {
		const newBlog = {}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)
		
		const response = await helper.getAllBlogsInDb()
		expect(response).toHaveLength(helper.testData.length)
	})

	test('blog without likes, will have a default 0 value', async () => {
		const blog = helper.blogWithoutLikes
		const users = await helper.usersInDb()
		blog.userId = users[0]._id
		const result = await api
			.post('/api/blogs')
			.send(blog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		expect(result.body.likes).toBe(0)
	})

	test('request with missing title get error', async () => {
		const blog = helper.blogWithoutTitle

		const result = await api
			.post('/api/blogs')
			.send(blog)
			.expect(400)
		expect(String(result.body.error)).toContain('missing title')
	})

	test('request with missing url get error', async () => {
		const blog = helper.blogWithoutUrl

		const result = await api
			.post('/api/blogs')
			.send(blog)
			.expect(400)
		expect(String(result.body.error)).toContain('missing url')
	})
})

describe('DELETE /api/blogs/{id}', () => {
	test('a specific blog can be deleted', async () => {
		const before = await helper.getAllBlogsInDb()
		const blogToDelete = before[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)
		const after = await helper.getAllBlogsInDb()
		expect(after).toHaveLength(before.length - 1)

		const titles = after.map(e => e.title)
		expect(titles).not.toContain(blogToDelete.title)
	})
})

describe('PUT {body} /api/blogs/{id}', () => {
	test('an amount of likes updates', async () => {
		const blogs = await helper.getAllBlogsInDb()
		const before = blogs[0].likes
		const likes = {
			likes: blogs[0].likes + 1
		}

		const response = await api
			.put(`/api/blogs/${blogs[0].id}`)
			.send(likes)
			.expect(200)
		const after = response.body.likes
		expect(after).toBe(before + 1)
	})
})

afterAll(() => {
	mongoose.connection.close()
})