const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    movieId: Number,
    title: String,
    genres: String,
    poster_path: String,
    overview: String,
    trailerId: String,
    actorName: String,
    release_date: String,
});

module.exports = mongoose.model('Movie', movieSchema);