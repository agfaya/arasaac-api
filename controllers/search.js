'use strict';

const Pictogram = require('../models/pictogram');
const Category = require('../models/category');
const User = require('../models/user');
const logger = require('../services/logger');

function searchPictograms (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let pictogram_name = req.params.string.toString();
    Pictogram.find({ name : { $regex: pictogram_name}}, (err, pictograms) => {
        if(err) {
            logger.error(err.message);
            return res.status(400).send({message: 'Bad request'});
        }
        if(!pictograms[0]) {
            logger.error('Pictograms not found');
            return res.status(404).send({message: 'Pictograms not found'});
        }
        else {
			Category.populate(pictograms, {path: "category"}, function(err, pictograms){
                res.status(200).send({pictograms});
                logger.info('Request successfully completed');
			});
		}
    }).sort({name: 1});
}

function searchCategories (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let category_name = req.params.string.toString();
    Category.find({ name : { $regex: category_name}}, (err, categories) => {
        if(err) {
            logger.error(err.message);
            return res.status(400).send({message: 'Bad request'});
        }
        if(!categories[0]) {
            logger.error('Categories not found');
            return res.status(404).send({message: 'Categories not found'});
        }
        else {
            res.status(200).send({categories});
            logger.info('Request successfully completed');
        }
    }).sort({name: 1});
}

function searchUsers (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let user_name = req.params.string.toString();
    User.find({ name : { $regex: user_name}}, (err, users) => {
        if(err) {
            logger.error(err.message);
            return res.status(400).send({message: 'Bad request'});
        }
        if(!users[0]) {
            logger.error('Users not found');
            return res.status(404).send({message: 'Empty database'});
        }
        else {
            res.status(200).send({users});
            logger.info('Request successfully completed');
        }
    }).sort({name: 1});
}

module.exports = {
    searchPictograms,
	searchCategories,
	searchUsers
};
