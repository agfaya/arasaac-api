'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = Schema ({
    name: {type: String, required:true},
    description: String,
});

module.exports = mongoose.model('category', categorySchema);