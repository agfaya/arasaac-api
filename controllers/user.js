'use strict';

const User = require('../models/user');
const services = require('../services');
const logger = require('../services/logger');

function signUp(req, res) {

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    const user = new User({
        email: req.body.email,
        name: req.body.name,
        type: req.body.type,
        password: req.body.password,
        lastLogin: Date.now()
    });

    if(!user.validateSync()) {
        User.findOne({email: req.body.email}, (err, userFounded) => {
            if (err) {
                logger.error(err.message);
                res.status(500).send({message: err});
            }
            if (!userFounded) {
                user.save((err) => {
                    if (err) {
                        logger.error(err.message);
                        res.status(500).send({message: "Error creating the user"});
                    }// ${err}`});
                    logger.info('New User: '+req.body.email+'. Request successfully completed');
                    return res.status(200).send({token: services.createToken(user)})
                })
            } else {
                logger.error('The email is already being used');
                return res.status(500).send({message: "This email is already being used"});
            }
        });
    } else {
        logger.error('Incomplete fields');
        return res.status(500).send({message: "You must fill in all fields"});
    }
}

function signIn(req, res, next) {

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let {email, password} = req.body;

    if(!email){
        logger.error('Field email incomptete');
        res.status(400).send({message: 'You must introduce the email'})
    } else if(!password){
        logger.error('Field password incomptete');
        res.status(400).send({message: 'You must introduce the password'})
    } else {
        User.findOne({email: req.body.email}, (err, user) => {
            if (err) {
                logger.error(err.message);
                res.status(500).send({message: 'Bad Request'});
            }
            if (!user) {
                logger.error('User doesnt exist');
                return res.status(404).send({message: 'User doesnt exist'});
            }

            user.comparePassword(req.body.password, function (err, isMatch) {
                if (err) {
                    logger.error(`Error al ingresar: ${err}`);
                    return res.status(500).send({message: 'Error al ingresar'});
                }
                if (!isMatch) {
                    logger.error(`Incorrect password: ${req.body.email}`);
                    return res.status(404).send({msg: 'Incorrect password'});
                }

                const token = services.createToken(user);

                req.session.userInfo = { user: user, token: token};

                res.status(200).send({
                    message: 'Logged in correctly',
                    token: token,
                    email: req.body.email
                });
                logger.info('User: '+email+' logged in correctly. Request successfully completed');
                //req.user = user;
            })
            //});
        })
    }
}

function getUsers (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    User.find({}, (err, users) => {
        if (err) {
            logger.error(err.message);
            return res.status(400).send({message: 'Bad request'});
        }
        if (!users[0]) {
            logger.error('Empty database');
            return res.status(404).send({message: 'Empty database'});
        }
        res.status(200).send({users});
        logger.info('Request successfully completed');
    }).sort({name: 1});
}

function getUser (req, res){

    logger.info(`${req.protocol.toUpperCase()} ${req.method} request [${req.originalUrl}] from ${req.ip}`);

    let user_id = req.params.user_id;

    User.findById(user_id, (err, user) => {
        if (err) {
            logger.error(err.message);
            return res.status(400).send({message: 'Bad request'});
        }
        if (!user) {
            logger.error('User not found');
            return res.status(404).send({message: 'User not found'});
        }
        res.status(200).send({user});
        logger.info('Request successfully completed');
    })

}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUser
};