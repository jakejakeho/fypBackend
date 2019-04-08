const express = require('express');
const router = express.Router();


const Token = require('../../models/token')
const User = require('../../models/user')
const Movie = require('../../models/movie')


// get history
// router.get('/', (req, res, next) => {
//     Token.findOne({ accessToken: req.headers.authorization.replace("Bearer ", "") })
//         .exec()
//         .then(docs => {
//             console.log("id = " + docs.user.id);
//             User.findOne({ username: docs.user.id })
//                 .exec()
//                 .then(doc => {
//                     console.log("From database" + doc);
//                     if (doc) {
//                         let result = [];
//                         for (let index = 0; index < doc.history.length; index++) {
//                             let el = doc.genre_history[index].movieId;
//                             if (result.indexOf(el) === -1) {
//                                 result.push(el);
//                             }
//                         }
//                         console.log("result = " + result);
//                         Movie.find({
//                             'movieId': {
//                                 $in: result
//                             }
//                         }, function (err, docs) {
//                             res.status(200).json(docs);
//                         });
//                     } else {
//                         res.status(404).json({
//                             message: 'No valid entry found for provided ID'
//                         })
//                     }
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     res.status(500).json({ error: err });
//                 });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

// insert history
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
                        var history = {
                            genre: req.body.genre,
                            date: new Date(0).setUTCSeconds(req.body.date),
                        };
                        doc.genre_history.push(history);
                        doc.save();
                        res.status(200).json(doc.history);
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