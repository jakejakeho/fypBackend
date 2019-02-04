const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    name: String,
    userImage: String
});

module.exports = mongoose.model('user', userSchema);