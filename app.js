const express = require('express');
const app = express();
const path = require("path");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request
const Response = OAuth2Server.Response;

const movieRoutes = require('./api/routes/movies');
const userInfoRoutes = require('./api/routes/users/info');
const userHistoryRoutes = require('./api/routes/users/history');
const userRecommendRoutes = require('./api/routes/users/recommend');
const userRegisterRoutes = require('./api/routes/users/register');
const userRatingRoutes = require('./api/routes/users/rating');
app.oauth = new OAuth2Server({
	model: require('./oauthModel.js'),
	accessTokenLifetime: 60 * 60 * 24 * 365,
	allowBearerTokensInQueryString: true
});

global.rootDir = path.resolve(__dirname);;
if(process.env.HTTP_PORT){
    mongoose.connect('mongodb://admin:awesomefyp@localhost:27017/dev?authSource=admin'
    ,{useNewUrlParser:true});
}else{
    mongoose.connect('mongodb://admin:awesomefyp@fypbackend.mooo.com:27017/dev?authSource=admin'
    ,{useNewUrlParser:true});
}
// app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
app.use(morgan('dev'));
app.use('/file', express.static('file'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// for broswer CORS error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, application/x-www-form-urlencoded');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// oAuth token 
app.all('/users/login', obtainToken);
app.use('/users/register', userRegisterRoutes);
app.use('/users/info', authenticateRequest, userInfoRoutes);
app.use('/users/history', authenticateRequest, userHistoryRoutes);
app.use('/users/rating', authenticateRequest, userRatingRoutes);
app.use('/users/recommend', authenticateRequest, userRecommendRoutes);
app.use('/movies', movieRoutes);



app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

function obtainToken(req, res) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.token(request, response)
		.then(function (token) {

			res.json(token);
		}).catch(function (err) {

			res.status(err.code || 500).json(err);
		});
}

function authenticateRequest(req, res, next) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.authenticate(request, response)
		.then(function (token) {
			next();
		}).catch(function (err) {

			res.status(err.code || 500).json(err);
		});
}

module.exports = app;