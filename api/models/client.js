const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
	clientId: String,
	clientSecret: String,
	grants: [String],
	redirectUris: [String]
});

module.exports = mongoose.model('client', clientSchema);