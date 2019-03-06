'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pictogramSchema = Schema ({
    name: String,
    description: String,
    img: String,
    sound: String,
    category: {type: String, enum: ['alphabet', 'adjectives']}
});

module.exports = mongoose.model('pictogram', pictogramSchema);