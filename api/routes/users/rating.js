const express = require('express');
const router = express.Router();


const Token = require('../../models/token')
const User = require('../../models/user')
const Movie = require('../../models/movie')


// get rating
router.get('/', (req, res, next) => {
    Token.findOne({ accessToken: req.headers.authorization.replace("Bearer ", "") })
        .exec()
        .then(docs => {
            console.log("id = " + docs.user.id);
            User.findOne({ username: docs.user.id })
                .exec()
                .then(doc => {
                    console.log("From database" + doc);
                    if (doc) {
                        res.status(200).json(doc.rating);
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

// insert rating
router.post('/', (req, res, next) => {
    Token.findOne({ accessToken: req.headers.authorization.replace("Bearer ", "") })
        .exec()
        .then(docs => {
            console.log("id = " + docs.user.id);
            User.findOne({ username: docs.user.id })
                .exec()
                .then(doc => {
                    console.log("From database" + doc);
                    if (doc) {
                        var rating = {
                            movieId: req.body.movieId,
                            rating: req.body.rating,
                            date: new Date(0).setUTCSeconds(req.body.date),
                        };
                        var found = false;
                        for (var index = 0; index < doc.rating.length; index++) {
                            if (doc.rating[index].movieId == rating.movieId) {
                                doc.rating[index].rating = rating.rating;
                                doc.rating[index].date = rating.date;
                                found = true;
                            }
                        }
                        if (!found) {
                            doc.rating.push(rating);
                        }
                        doc.save();
                        res.status(200).json(doc.rating);
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