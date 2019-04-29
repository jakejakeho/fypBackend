var mongoose = require('mongoose');

/**
 * Configuration.
 */

var clientModel = require('./api/models/client'),
	tokenModel = require('./api/models/token'),
	userModel = require('./api/models/user');

/**
 * Dump the database content (for debug).
 */

var dump = function () {

	clientModel.find(function (err, clients) {
		if (err) {
			c
			return console.error(err);
		}
		console.log('clients', clients);
	});

	tokenModel.find(function (err, tokens) {

		if (err) {
			return console.error(err);
		}
		console.log('tokens', tokens);
	});

	userModel.find(function (err, users) {

		if (err) {
			return console.error(err);
		}
		console.log('users', users);
	});
};

/*
 * Methods used by all grant types.
 */

var getAccessToken = function (token) {

	return tokenModel.findOne({
		accessToken: token
	});
};

var getClient = function (clientId, clientSecret) {
	console.log(clientId + clientSecret);
	result =  clientModel.findOne({
		clientId: clientId,
		clientSecret: clientSecret
	});
	console.log(result);
	return result;
};

var saveToken = function (token, client, user) {

	token.client = {
		id: client.clientId
	};

	token.user = {
		id: user.username || user.clientId
	};

	var tokenInstance = new tokenModel(token);

	console.log("save");
	tokenInstance.save();

	return token;
};

/*
 * Method used only by password grant type.
 */

var getUser = function (username, password) {

	return userModel.findOne({
		username: username,
		password: password
	});
};

/*
 * Method used only by client_credentials grant type.
 */

var getUserFromClient = function (client) {

	return clientModel.findOne({
		clientId: client.clientId,
		clientSecret: client.clientSecret,
		grants: 'client_credentials'
	});
};

/**
 * Export model definition object.
 */

module.exports = {
	getAccessToken: getAccessToken,
	getClient: getClient,
	saveToken: saveToken,
	getUser: getUser,
	getUserFromClient: getUserFromClient
};
