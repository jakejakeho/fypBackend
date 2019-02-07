const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    profile: [{
        name: String,
        email: String,
        userImage: String,
    }],
    recommend: [{ movieId: String }],
    history: [{
        movieId: String,
        startDate: Date,
        endDate: Date,
    }],
    rating: [{
        movieId: String,
        rating: Number,
        date: Date,
    }]
});

module.exports = mongoose.model('user', userSchema);