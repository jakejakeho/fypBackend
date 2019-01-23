const fs = require('fs');
const http = require('http');
const https = require('https');
const request = require('request');



const app = require('./app');
const HTTPPort = process.env.HTTP_PORT || 3000;
const HTTPSPort = process.env.HTTPS_PORT || 3001;

const options = {
    cert: fs.readFileSync('./cert/fullchain.pem'),
    key: fs.readFileSync('./cert/privkey.pem')
};

// DDNS update
request('https://freedns.afraid.org/dynamic/update.php?TEV5Q1laVmVsMnFXcmExSTNDcDR1NXhjOjE4MDQwNTM1', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
});

const DDNSUpdater = setInterval(function () {
    request('https://freedns.afraid.org/dynamic/update.php?TEV5Q1laVmVsMnFXcmExSTNDcDR1NXhjOjE4MDQwNTM1', function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
    });
}, 1000);

const httpServer = http.createServer(app);
httpServer.listen(HTTPPort, () => {
    console.log('HTTP Server running on port' + HTTPPort);
});

https.createServer(options, app).listen(HTTPSPort, () => {
    console.log('HTTPS Server running on port' + HTTPSPort);
});
