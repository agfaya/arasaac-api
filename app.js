'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const app = express();
const api = require('./routes');
//const session = require('express-session');

//app.use(session({ resave: false, saveUninitialized: false, secret: '123456789' }));
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('.hbs', hbs({
    defaultLayout: 'default',
    extname: '.hbs'
}));

//views

app.set('view engine', 'hbs');
app.use('/api', api);

app.get('/', (req, res) => {
    res.render('./public/index.html');
});

app.get('/login', (req, res) => {
   res.render('login')
});

app.get('/pictograms/upload', (req, res) => {
    res.render('uploadPictograms')
});


module.exports = app;