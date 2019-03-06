'use strict';

const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const services = require('../services');

function signUp(req, res){
    const user = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        lastLogin: Date.now()
    });

    user.save((err) => {
        if(err) res.status(500).send({message: `Error al crear el usuario: ${err}`});
        return res.status(200).send({token: services.createToken(user)})
    })
}

function signIn(req, res){
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) res.status(500).send({message: err});
        if(!user) return res.status(404).send({message: 'User doesnt exist'});

        user.comparePassword(req.body.password,function(err, isMatch){
            if (err) return res.status(500).send({message: `Error al ingresar: ${err}`});
            if (!isMatch) return res.status(404).send({msg: `Incorrect password: ${req.body.email}`});
            res.status(200).send({
                message: 'Logged in correctly',
                token: services.createToken(user)
            });
            //req.user = user;
        })
        //});
    })
}

function getUsers (req, res){
    User.find({}, (err, users) => {
        if(err) return res.status(400).send({message: `Bad request: ${err} `});
        if(!users) return res.status(404).send({message: 'Empty database'});
        res.status(200).send({users})
    });
}

function getUser (req, res){
    let user_id = req.params.user_id;
    User.findById(user_id, (err, user) => {
        if(err) return res.status(400).send({message: `Bad request: ${err}`});
        if(!user) return res.status(404).send({message: 'User not found.'});
        res.status(200).send({user})
    })
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUser
};