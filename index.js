'use strict';

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const app = require('./app');
const config = require('./config');

mongoose.connect(config.db, {useNewUrlParser: true}, (err) => {
    if (err) {
        return console.log(`Error establishing a database connection: ${err}`);
    }
    console.log('Successful database connection');

    app.listen(config.port, () => {
        console.log(`Arasaac API REST running in http://localhost:${config.port}`)
    })
});
