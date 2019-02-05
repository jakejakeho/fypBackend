const express = require('express');
const router = express.Router();


const Token = require('../../models/token')
const User = require('../../models/user')



// get users
router.get('/', (req, res, next) => {
    Token.findOne({ accessToken: req.headers.authorization.replace("Bearer ", "") })
        .exec()
        .then(docs => {
            console.log("id = " + docs.user.id);
            User.findOne({ username: docs.user.id })
                .exec()
                .then(doc => {
                    doc.password = undefined;
                    console.log("From database" + doc);
                    if (doc) {
                        res.status(200).json(doc.profile[0]);
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
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;