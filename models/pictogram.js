'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pictogramSchema = Schema ({
    name: { type : String, required: true },
    description: String,
    img: String ,
    sound: String,
    category: String
});

module.exports = mongoose.model('pictogram', pictogramSchema);