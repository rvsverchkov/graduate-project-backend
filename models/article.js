const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        validate: {
            validator(link) {
            return validator.isURL(link);
            },
        },
        required: true,
    },
    image: {
        type: String,
        validate: {
            validator(link) {
            return validator.isURL(link);
            },
        },
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
        select: false,
    },
});

articleSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.owner;
    return obj;
};

articleSchema.statics.findArticleByCredentials = function (id) {
    return this.findById(id).select('+owner')
};

module.exports = mongoose.model('article', articleSchema);