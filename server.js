const fs = require('fs');
const http = require('http');
const https = require('https');

const app = require('./app');
const HTTPPort = process.env.HTTP_PORT || 3000;
const HTTPSPort = process.env.HTTPS_PORT;

const httpServer = http.createServer(app);
httpServer.listen(HTTPPort, () => {
    console.log('HTTP Server running on port' + HTTPPort);
});