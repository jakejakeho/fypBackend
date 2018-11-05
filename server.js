const fs = require('fs');
const http = require('http');
const https = require('https');

const app = require('./app');
const HTTPPort = process.env.HTTP_PORT || 3000;
const HTTPSPort = process.env.HTTPS_PORT;
const privateKey = fs.readFileSync(__dirname + '\\ssl\\private.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '\\ssl\\certificate.crt', 'utf8');
const ca = fs.readFileSync(__dirname + '\\ssl\\ca_bundle.crt', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(HTTPPort, () => {
    console.log('HTTP Server running on port' + HTTPPort);
});
if(typeof HTTPSPort !== 'undefined'){
    httpsServer.listen(HTTPSPort, () => {
        console.log('HTTPS Server running on port' + HTTPSPort);
    });
}
