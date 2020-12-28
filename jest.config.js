module.exports = {
	testEnvironment: 'node',
	collectCoverageFrom: [
		"**/*.{js,jsx}",
		"!**/coverage/**",
		"!**/list_helper.js",
		"!**/test_helper.js",
		"!**/jest.config.js"
	]
}

