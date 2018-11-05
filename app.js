const express = require('express');
const app = express();
const path = require("path");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const certRoutes = require('./api/routes/cert');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const privacyRoutes = require('./api/routes/privacy');
const pingRoutes = require('./api/routes/ping');
global.rootDir = path.resolve(__dirname);;

mongoose.connect('mongodb://jake:jake@localhost:27017/dev?authSource=admin'
    ,{useNewUrlParser:true});


// app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// for broswer CORS error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/.well-known/acme-challenge/', certRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/privacy', privacyRoutes);
app.use('/ping', pingRoutes);


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

module.exports = app;