const fs = require('fs');
const http = require('http');
const https = require('https');

const app = require('./app');
const HTTPPort = process.env.HTTP_PORT || 3000;
const HTTPSPort = process.env.HTTPS_PORT || 3001;

const options = {
    cert: fs.readFileSync('./cert/fullchain.pem'),
    key: fs.readFileSync('./cert/privkey.pem')
};

// const httpServer = http.createServer(app);
// httpServer.listen(HTTPPort, () => {
//     console.log('HTTP Server running on port' + HTTPPort);
// });

https.createServer(options, app).listen(HTTPSPort, () => {
    console.log('HTTPS Server running on port' + HTTPSPort);
});
