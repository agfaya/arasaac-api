'use strict';

const express = require('express');
const pictogramCtrl = require('../controllers/pictogram');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const api = express.Router();

//pictograms
api.get('/pictograms', pictogramCtrl.getPictograms);
api.get('/pictograms/:pictogram_id', pictogramCtrl.getPictogram);
api.post('/pictograms', auth, pictogramCtrl.savePictogram);
api.put('/pictograms/:pictogram_id', auth, pictogramCtrl.updatePictogram);
api.delete('/pictograms/:pictogram_id', auth, pictogramCtrl.deletePictogram);

//users
api.get('/users', userCtrl.getUsers);
api.get('/users/:user_id', userCtrl.getUser);
api.post('/signup', userCtrl.signUp);
api.post('/signin', userCtrl.signIn);

module.exports = api;