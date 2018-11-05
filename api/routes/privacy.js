const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.status(200).sendFile(path.join(__basedir + '/privacy/privacy.html'));
});

module.exports = router;    