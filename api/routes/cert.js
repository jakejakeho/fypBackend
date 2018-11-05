const express = require('express');
const router = express.Router({mergeParams: true});


router.get('/:id', (req, res, next) => {
    res.sendFile("_Bqj5RO8HW8TMqAsQ2oqph9J_s41ll89OGvMmLR9ovs", {root: __dirname });
});

module.exports = router;