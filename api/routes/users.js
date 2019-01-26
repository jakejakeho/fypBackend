const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user')

// get users
router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// get user by id
router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findOne({ userId: id })
        .exec()
        .then(doc => {
            console.log("id = " + id);
            console.log("From database" + doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


module.exports = router;