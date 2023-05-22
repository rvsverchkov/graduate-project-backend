const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    array: {
        type: Array
    }
});

module.exports = mongoose.model('answer', answerSchema);