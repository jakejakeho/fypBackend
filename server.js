const fs = require('fs');
const https = require('https');

const app = require('./app');
const port = process.env.PORT || 3001;
const privateKey = fs.readFileSync(__dirname + '\\ssl\\private.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '\\ssl\\certificate.crt', 'utf8');
const ca = fs.readFileSync(__dirname + '\\ssl\\ca_bundle.crt', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
	console.log('HTTPS Server running on port' + port);
});