'use strict';

const exceltojson = require("xlsx-to-json");
const Pictogram = require('../models/pictogram');
const Category = require('../models/category');
const file = require('../services');
const publicIp = require("public-ip");
const logger = require('../services/logger');
const User = require('../models/user');

function getPictograms (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    var page = parseInt(req.query.page);
    var perPage = parseInt(req.query.perPage);

    Pictogram.find({}, {}, {skip: (page-1)*perPage, limit: perPage}, (err, pictograms) => {

        if(err) {
            logger.error(err.message);
            return res.status(400).send({message: 'Bad request'});
        }
        if(!pictograms[0]) {
            logger.error('Empty database');
            return res.status(404).send({message: 'Empty database'});
        }
        Category.populate(pictograms, {path: "category"}, function(err, pictograms){
            res.status(200).send({pictograms});
            logger.info('Request successfully completed');
        });

    }).sort({name: 1});
}

function getPictogram (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let pictogram_id = req.params.pictogram_id;

    Pictogram.findById(pictogram_id, (err, pictogram) => {
        if (err) {
            logger.error(err.message);
            return res.status(400).send({message: 'Id not valid'});
        }
        if (!pictogram) {
            logger.error('Pictogram not found');
            return res.status(404).send({message: 'Pictogram not found'});
        }
        Category.populate(pictogram, {path: "category"}, function (err, pictogram) {
            res.status(200).send({pictogram});
            logger.info('Request successfully completed');
        });
    })
}

function savePictogram (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let pictogram = new Pictogram();

    pictogram.name = req.body.name;
    pictogram.description = req.body.description;
    pictogram.img = req.body.img;
    pictogram.sound = req.body.sound;
    pictogram.category = req.body.category;


    User.findById(req.user, (err, user) => {
        if(user.permissions === "rw") {
            if (!pictogram.name) {
                logger.error("You must specify at least the name of the pictogram");
                res.status(500).send({message: "You must specify at least the name of the pictogram"});
            } else {
                pictogram.save((err, pictogramStored) => {
                    if (err) {
                        logger.error(err.message);
                        return res.status(500).send({message: 'Error saving into the database'});
                    }
                    res.status(200).send({pictogram: pictogramStored});
                    logger.info('Request successfully completed');
                })
            }
        }else{
            logger.error("["+user.email+"] doesn't have permission");
            return res.status(403).send({message: 'You dont have permission.'});
        }
    });
}

function updatePictogram (req, res) {

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let pictogram_id = req.params.pictogram_id;
    let {name, description, img, sound, category} = req.body;

    let update = {};
    if(name) update.name = name;
    if(description) update.description = description;
    if(img) update.img = img;
    if(sound) update.sound = sound;
    if(category) update.category = category;

    User.findById(req.user, (err, user) => {
        if(user.permissions === "rw") {
            if (!name && !description && !img && !sound && !category) {
                logger.error("You must specify the field you want to update");
                return res.status(400).send({message: "You must specify the field you want to update"});
            } else {
                Pictogram.findOneAndUpdate({_id: pictogram_id}, update, (err, pictogramUpdated) => {
                    if (err) {
                        logger.error(err.message);
                        return res.status(400).send({message: 'Pictogram not updated'});
                    }
                    res.status(200).send({prictogram: pictogramUpdated});
                    logger.info('Request successfully completed');
                })
            }
        }else{
            logger.error("["+user.email+"] doesn't have permission");
            return res.status(403).send({message: 'You dont have permission.'});
        }
    });
}

function deletePictogram (req, res) {

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let pictogram_id = req.params.pictogram_id;

    User.findById(req.user, (err, user) => {
        if(user.permissions === "rw") {
            Pictogram.findById(pictogram_id, (err, pictogram) => {
                if (err) {
                    logger.error(err.message);
                    return res.status(400).send({message: 'Id not valid'});
                }
                if (!pictogram) {
                    logger.error('Pictogram not found');
                    return res.status(404).send({message: 'Pictogram not found'});
                }
                pictogram.remove(err => {
                    if (err) {
                        logger.error(err.message);
                        return res.status(400).send({message: 'Pictogram not deleted'});
                    }
                    res.status(200).send({message: 'Sucessfully deleted'});
                    logger.info('Request successfully completed');
                })
            })
        } else {
            logger.error("["+user.email+"] doesn't have permission");
            return res.status(403).send({message: 'You dont have permission.'});
        }
    });
}

async function loadPictograms(req, res) {

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    User.findById(req.user, (err, user) => {
        if(user.permissions === "rw"){
            file.uploadPictograms(req, res, function (err) {
                if (err) {
                    logger.error(err.message);
                    return res.status(400).send({message: 'Bad request'});
                }
                if (!req.file) {
                    return res.status(400).send({message: 'No file passed'});
                } else {
                    try {
                        exceltojson({
                            input: req.file.path,
                            output: null,
                            lowerCaseHeaders: true //to convert all excel headers to lower case in json
                        }, function (err, result) {
                            if (err) {
                                console.error(err);
                            } else {
                                publicIp.v4().then(ip => {
                                    for(var i = 0; i<result.length; i++) {
                                        const item = result[i];
                                        Category.findById(item.category, (err, category) => {
                                            var values = {
                                                $set: {
                                                    name: item.name,
                                                    description: item.description,
                                                    img: "http://"+ip+":3000/pictograms/" + category.name + "/" + item.name + ".png",
                                                    sound: "http://"+ip+":3000/sounds/" + category.name + "/" + item.name + ".mp3",
                                                    category: item.category
                                                }
                                            };
                                            Pictogram.collection.updateOne({name: item.name}, values, {upsert: true});
                                        });
                                    }
                                    if (err) return res.status(400).send({message: 'Bad request'});
                                    res.status(200).send({message: 'Successfully loaded'});
                                    logger.info('Request successfully completed');
                                });
                            }
                        })
                    } catch (err) {
                        return res.status(400).send({message: "Corrupted excel file"});
                    }
                }
            })
        }else {
            logger.error("["+user.email+"] doesn't have permission");
            return res.status(403).send({message: 'You dont have permission.'});
        }
    });
}

module.exports = {
    getPictograms,
    getPictogram,
    savePictogram,
    updatePictogram,
    deletePictogram,
    loadPictograms
};
