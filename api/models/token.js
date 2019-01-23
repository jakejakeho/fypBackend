const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
	accessToken: String,
	accessTokenExpiresAt: Date,
	refreshToken: String,
	refreshTokenExpiresAt: Date,
	client: Object,
	user: Object
});

module.exports = mongoose.model('token', tokenSchema);