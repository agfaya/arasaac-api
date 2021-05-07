'use strict';

const Category = require('../models/category');
const Pictogram = require('../models/pictogram');
const User = require('../models/user');
const logger = require('../services/logger');

function getCategories (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    Category.find({}, (err, categories) => {
        if(err) {
            logger.log(err.message);
            return res.status(400).send({message: 'Bad request'});
        }
        if(!categories[0]) {
            logger.error('Empty database');
            return res.status(404).send({message: 'Empty database'});
        }
        res.status(200).send({categories});
        logger.info('Request successfully completed');
    }).sort({name: 1});
}

function getCategory (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let category_id = req.params.category_id;

    Category.findById(category_id, (err, category) => {
        if(err) {
            logger.error(err.message);
            return res.status(400).send({message: 'Id not valid'});
        }
        if(!category) {
            logger.error('Category not found');
            return res.status(404).send({message: 'Category not found'});
        }
        res.status(200).send({category});
        logger.info('Request successfully completed');
    })
}

function getCategoryPictograms(req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let category_name = req.params.category_name;

    Category.find({name: category_name}, (err, category) =>{
        if (err) {
            logger.error(err.message);
            return res.status(400).send({message: 'Bad request'});
        }
        if (!category[0]) {
            logger.error('Category not found');
            return res.status(404).send({message: 'Category not found.'});
        }
        else {
            Pictogram.find({category: category[0]._id}, (err, pictograms) => {
                if (err) {
                    logger.error(err.message);
                    return res.status(400).send({message: `Bad request: ${err} `});
                }
                if (!pictograms) {
                    logger.error('Pictograms not found');
                    return res.status(404).send({message: 'Empty database'});
                }
                Category.populate(pictograms, {path: "category"}, function (err, pictograms) {
                    res.status(200).send({pictograms});
                    logger.info('Request successfully completed');
                });
            }).sort({name: 1});
        }
    });
}

function saveCategory (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let category = new Category();
    category.name = req.body.name;
    category.description = req.body.description;

    User.findById(req.user, (err, user) => {
        if (user.permissions === "rw") {
            if (!category.name) {
                logger.error('You must specify at least the name of the category');
                res.status(400).send({message: "You must specify at least the name of the category"});
            } else {
                category.save((err, categoryStored) => {
                    if (err) {
                        logger.error(err.message);
                        res.status(500).send({message: 'Error saving into the database'});
                    }
                    res.status(200).send({category: categoryStored});
                    logger.info('Request successfully completed');
                })
            }
        } else {
            logger.error("[" + user.email + "] doesn't have permission");
            return res.status(403).send({message: 'You dont have permission.'});
        }
    });
}

function updateCategory (req, res) {

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let category_id = req.params.category_id;
    let {name, description} = req.body;

    let update = {};
    if(name) update.name = name;
    if(description) update.description = description;

    User.findById(req.user, (err, user) => {
        if (user.permissions === "rw") {
            if (!name && !description) {
                logger.error('You must specify the field you want to update');
                res.status(400).send({message: "You must specify the field you want to update"});
            } else {
                Category.findOneAndUpdate({_id: category_id}, update, (err, categoryUpdated) => {
                    if (err) {
                        logger.error(err.message);
                        return res.status(400).send({message: 'Id not valid'});
                    }
                    res.status(200).send({category: categoryUpdated});
                    logger.info('Request successfully completed');
                })
            }
        } else {
            logger.error("[" + user.email + "] doesn't have permission");
            return res.status(403).send({message: 'You dont have permission.'});
        }
    });
}

function deleteCategory (req, res) {

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let category_id = req.params.category_id;

    User.findById(req.user, (err, user) => {
        if (user.permissions === "rw") {
            Category.findById(category_id, (err, category) => {
                if (err) {
                    logger.error(err.message);
                    return res.status(400).send({message: 'Id not valid'});
                }
                category.remove(err => {
                    if (err) {
                        logger.error(err.message);
                        return res.status(400).send({message: 'Category not deleted'});
                    }
                    res.status(200).send({message: 'Sucessfully deleted'});
                    logger.info('Request successfully completed');
                })
            })
        } else {
            logger.error("[" + user.email + "] doesn't have permission");
            return res.status(403).send({message: 'You dont have permission.'});
        }
    });
}

module.exports = {
    getCategories,
    getCategory,
    getCategoryPictograms,
    saveCategory,
    updateCategory,
    deleteCategory
};
