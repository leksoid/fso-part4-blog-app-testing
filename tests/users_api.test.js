const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')

const usersData = [
	{
		username: 'alex',
		name: 'Alexio Juno',
	},
	{
		username: 'shalex',
		name: 'Alexandro Qe',
	},
	{
		username: 'root',
		name: 'root'
	}
]

beforeEach(async () => {
	await User.deleteMany({})
	const passwordHash = await bcrypt.hash('sekret', 10)
	const hashed = usersData.map(e => ({...e, passwordHash}))
	const users = hashed.map(e => new User(e))
	// make save() call for each ^^ and save promises in array - this is done in parallel
	const promiseArray = users.map(e => e.save())
	// wait for all promises to resolve 
	await Promise.all(promiseArray)
})

describe('GET /api/users', () => {
	test('returns a list of pre-existing users', async () => {
		const result = await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body).toHaveLength(usersData.length)
	})

})

describe('POST {new_user} /api/users', () => {
	test('creation of new user succeeds', async () => {
		const before = await helper.usersInDb()

		const newUser = {
			username: 'Shambala',
			name: 'Alex T',
			password: '12monkeys'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const after = await helper.usersInDb()
		expect(after).toHaveLength(before.length + 1)

		const usernames = after.map(e => e.username)
		expect(usernames).toContain(newUser.username)
	})

	test('cannot create a user with same username', async () => {
		const before = await helper.usersInDb()
		
		const newUser = {
			username: 'root',
			name: 'Groot',
			password: 'salmon'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('`username` to be unique')

		const after = await helper.usersInDb()
		expect(after).toHaveLength(before.length)
	})
})

afterAll(() => {
	mongoose.connection.close()
})