const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Movie = require('../models/movie')

// get add movies
var perPage = 10;
router.get('/', (req, res, next) => {
    Movie.find({ genres: new RegExp(req.body.genres, 'i') })
        .limit(perPage)
        .skip(perPage * parseInt(req.body.page))
        .sort('-release_date')
        .exec()
        .then(docs => {
            // console.log(docs);
            res.status(200).send(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// get movie by id
router.get('/:movieId', (req, res, next) => {
    const id = req.params.movieId;
    Movie.findOne({ movieId: id })
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

// upload movie

// router.post('/', (req, res, next) => {
//     const movie = new Movie({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         price: req.body.price
//     });
//     movie.save().then(result => {
//         console.log(result);
//         res.status(201).json({
//             message: 'Handling POST requests to /products',
//             createdProduct: product
//         })
//     })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

module.exports = router;