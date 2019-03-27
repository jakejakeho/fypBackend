const express = require('express');
const router = express.Router();


const Token = require('../../models/token')
const User = require('../../models/user')
const Movie = require('../../models/movie')


// get recommendation
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
                        let result = [];
                        for (let index = 0; index < doc.recommend.length; index++) {
                            let el = doc.recommend[index].movieId;
                            if (result.indexOf(el) === -1) {
                                result.push(el);
                            }
                        }
                        console.log(result);
                        Movie.find({
                            'movieId': {
                                $in: result
                            }
                        }, function (err, docs) {
                            res.status(200).json(docs);
                        });
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

// insert recommendation
router.post('/', (req, res, next) => {
    Token.findOne({ accessToken: req.headers.authorization.replace("Bearer ", "") })
        .exec()
        .then(docs => {
            console.log("id = " + docs.user.id);
            User.findOne({ username: docs.user.id })
                .exec()
                .then(doc => {
                    console.log("From database" + doc);
                    movieIds = req.body.movieId;
                    if (doc) {
                        //clear recommend array
                        var temp = [];
                        movieIds.forEach((Ids)=>{
                            var recommend = {
                                movieId: Ids
                            };
                            temp.push(recommend);
                        });
                        doc.recommend = temp;
                        doc.save();
                        console.log("updated" + doc);
                        res.status(200).json(doc.recommend);
                    }else {
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