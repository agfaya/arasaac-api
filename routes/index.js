'use strict';

const express = require('express');
const pictogramCtrl = require('../controllers/pictogram');
const categoryCtrl = require('../controllers/category');
const userCtrl = require('../controllers/user');
const searchCtrl = require('../controllers/search');
const auth = require('../middlewares/auth');
const api = express.Router();

/**
 * @api {get} /pictograms/ Request Pictograms information
 * @apiName GetPictograms
 * @apiGroup Pictogram
 *
 * @apiSuccess {String} name Pictogram name.
 * @apiSuccess {String} description  Pictogram description.
 * @apiSuccess {String} img Pictogram image.
 * @apiSuccess {String} mp3 Pictogram sound.
 * @apiSuccess {String} category Pictogram category.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     	"_id": "5c8ff6d5b23f120004e05e7c",
 *     	"name": "a",
 *     	"description": "letter a",
 *     	"img": "https://s3.amazonaws.com/arasaac-img/a.png",
 *     	"sound": "https://s3.amazonaws.com/arasaac-mp3/a.mp3",
 *     	"category": {
 *     	    "_id": "5cdef979fb6fc00aaf763f20",
 *     	    "name": "alphabet",
 *     	    "description": "contains the alphabet letters"
 *     }
 *
 * @apiError PictogramNotFound The id of the Pictogram was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "PictogramNotFound"
 *     }
 */

api.get('/pictograms', auth, pictogramCtrl.getPictograms);

/**
 * @api {get} /pictograms/:id Request Pictogram information
 * @apiName GetPictogram
 * @apiGroup Pictogram
 *
 * @apiParam {pictogram_id} id Pictogram unique ID.
 *
 * @apiSuccess {String} name Pictogram name.
 * @apiSuccess {String} description  Pictogram description.
 * @apiSuccess {String} img Pictogram image.
 * @apiSuccess {String} mp3 Pictogram sound.
 * @apiSuccess {String} category Pictogram category.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     	"_id": "5c8ff6d5b23f120004e05e7c",
 *     	"name": "a",
 *     	"description": "letter a",
 *     	"img": "https://s3.amazonaws.com/arasaac-img/a.png",
 *     	"sound": "https://s3.amazonaws.com/arasaac-mp3/a.mp3",
 *     	"category": {
 *     	    "_id": "5cdef979fb6fc00aaf763f20",
 *     	    "name": "alphabet",
 *     	    "description": "contains the alphabet letters"
 *     }
 *
 * @apiError PictogramNotFound The id of the Pictogram was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "PictogramNotFound"
 *     }
 */

api.get('/pictograms/:pictogram_id', auth, pictogramCtrl.getPictogram);
api.get('/pictograms/search/:string', auth, searchCtrl.searchPictograms);
api.post('/pictograms', auth, pictogramCtrl.savePictogram);
api.put('/pictograms/:pictogram_id', auth, pictogramCtrl.updatePictogram);
api.delete('/pictograms/:pictogram_id', auth, pictogramCtrl.deletePictogram);
api.post('/pictograms/upload', auth, pictogramCtrl.loadPictograms);

/**
 * @api {get} /categories/ Request Categories information
 * @apiName GetCategories
 * @apiGroup Category
 *
 * @apiSuccess {String} name Category name.
 * @apiSuccess {String} description  Category description.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     	    "_id": "5cdef979fb6fc00aaf763f20",
 *     	    "name": "alphabet",
 *     	    "description": "contains the alphabet letters"
 *     }
 *
 * @apiError CategoryNotFound The id of the Category was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "CategoryNotFound"
 *     }
 */

api.get('/categories', auth, categoryCtrl.getCategories);

/**
 * @api {get} /categories/:id Request Category information
 * @apiName GetCategory
 * @apiGroup Category
 *
 * @apiParam {category_id} id Category unique ID.
 *
 * @apiSuccess {String} name Category name.
 * @apiSuccess {String} description  Category description.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     	    "_id": "5cdef979fb6fc00aaf763f20",
 *     	    "name": "alphabet",
 *     	    "description": "contains the alphabet letters"
 *     }
 *
 * @apiError CategoryNotFound The id of the Category was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "CategoryNotFound"
 *     }
 */

api.get('/categories/:category_id', auth, categoryCtrl.getCategory);
api.get('/categories/:category_name/pictograms', auth, categoryCtrl.getCategoryPictograms);
api.get('/categories/search/:string', auth, searchCtrl.searchCategories);
api.post('/categories', auth, categoryCtrl.saveCategory);
api.put('/categories/:category_id', auth, categoryCtrl.updateCategory);
api.delete('/categories/:category_id', auth, categoryCtrl.deleteCategory);

/**
 * @api {get} /users Request Users information
 * @apiName getUsers
 * @apiGroup Users
 *
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} name  Name of the User.
 * @apiSuccess {String} signupDate  Signup date of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
            "signupDate": "2019-02-06T14:09:06.725Z",
            "_id": "5c5aea8882d7bd2f70b55395",
            "email": "arasaac@gmail.com",
            "name": "arasaac",
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

api.get('/users', auth, userCtrl.getUsers);

/**
 * @api {get} /users/:id Request User information
 * @apiName getUser
 * @apiGroup Users
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} name  Name of the User.
 * @apiSuccess {String} signupDate  Signup date of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
            "signupDate": "2019-02-06T14:09:06.725Z",
            "_id": "5c5aea8882d7bd2f70b55395",
            "email": "arasaac@gmail.com",
            "name": "arasaac",
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

api.get('/users/:user_id', auth, userCtrl.getUser);
api.get('/users/search/:string', auth, searchCtrl.searchUsers);
api.post('/signup', userCtrl.signUp);
api.post('/signin', userCtrl.signIn);

module.exports = api;
