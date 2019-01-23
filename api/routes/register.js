const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user')

// register user
router.post('/', (req, res, next) => {
    // input validation
    const username = req.body.username;
    const password = req.body.password;
    // check if it exists
    User.findOne({ username: username })
        .exec()
        .then(doc => {
            console.log("username = " + username);
            console.log("From database" + doc);
            if (doc) {
                res.status(404).json({
                    message: 'Username existed'
                })
            } else {
                // input validation && doesn't exists
                if (username != null && username.length >= 8 && username.length <= 32
                    && password != null && password.length >= 8 && password.length <= 32) {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: username,
                        password: req.body.password
                    });
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Handling POST requests to /users/register',
                            createdUser: user
                        })
                    })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
                else {
                    res.status(500).json({
                        error: "Invalid input"
                    });
                }

            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;