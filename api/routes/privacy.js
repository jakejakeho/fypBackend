const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.sendFile("privacy.html", {root: __dirname });
});

module.exports = router;