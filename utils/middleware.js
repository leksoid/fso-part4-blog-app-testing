const errorHandler = (error, req, res, next) => {
	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformed id'})
	} else if (error.name === 'ValidationError') {
		return res.status(400).send({ error: error.message })
	} else if (error.name === 'JsonWebTokenError') {
		return res.status(401).json({ error: 'invalid token' })
	}
	next(error)
}

module.exports = {
	errorHandler
}