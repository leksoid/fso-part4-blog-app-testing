const blog = require("../models/blog");
const _ = require('lodash')

const dummy = (blogs) => {
	return 1 
}

const totalLikes = (blogs) => {
	let total = 0
	blogs.forEach(blog => {
		total += blog.likes 
	});
	return total
}

const favoriteBlog = (blogs) => {
	const max = blogs.reduce((acc, val) => {
		return acc.likes > val.likes ? acc : val
	})
	return {
		title: max.title,
		author: max.author,
		likes: max.likes
	}
}

const mostBlogs = (blogs) => {
	const entries = _.countBy(blogs, 'author')
	const author = Object.keys(entries).reduce((a, b) => entries[a] > entries[b] ? a : b);
	return {
		author: author,
		blogs: entries[author]
	}
}

const mostLikes = (blogs) => {
	const authors = {} 
	blogs.forEach(e => {
		authors[e.author] = authors[e.author] ? authors[e.author] + e.likes : e.likes
	});
	const mostLiked = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b);
	return {
		author: mostLiked,
		likes: authors[mostLiked]
	}
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}