const Blog = require('../models/blog')
const User = require('../models/user')

const testData = [
	{
		title: "Awesome js",
		author: "Alex",
		url: "https://www.fu.com",
		likes: 99
	},
	{
		title: "My kidney sucks",
		author: "John Travolta",
		url: "https://www.worldfamous.com",
		likes: 1
	}
]



const blogWithoutLikes = {
	title: "There is no like in here",
	author: "Life",
	url: "https://www.life.com",
}

const blogWithoutTitle = {
	author: 'Somebody',
	url: 'https://www.a1.com'
}

const blogWithoutUrl= {
	title: 'Something',
	author: 'Somebidy'
}

const getAllBlogsInDb = async () => {
	return await Blog.find({})
}

const nonExistingId = async () => {
	const blog = new Blog({
		title: "Dummy",
		author: "Dummy",
		url: "https://www.Dummy.com",
		likes: 11
	})
	await blog.save()
	await blog.remove()
	return blog.id.toString()
}

const usersInDb = async () => {
	return await User.find({})
}

module.exports = {
	getAllBlogsInDb, 
	nonExistingId, 
	usersInDb,
	testData,
	blogWithoutLikes,
	blogWithoutTitle,
	blogWithoutUrl,
}