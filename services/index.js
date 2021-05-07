'use strict';

const path = require('path');
const jwt = require('jwt-simple');
const moment = require('moment');
const multer = require('multer');
const config = require('../config');

function createToken (user){
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    };
    const token = jwt.encode(payload, config.SECRET_TOKEN);
    return token
}

function decodeToken (token) {
    const decoded = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.SECRET_TOKEN);
            if (payload.exp <= moment().unix()) {
                reject({
                    status: 401,
                    message: 'Token has expired'
                })
            }
            resolve(payload.sub)
        } catch (err) {
            reject({
                status: 500,
                message: 'Invalid token'
            })
        }
    });
    return decoded
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + path.extname(file.originalname));
    }
});

var uploadPictograms = multer({
    storage: storage,
    fileFilter: function(req, file, callback) { //file filter
        var ext = path.extname(file.originalname);
        if(ext !== '.xlsx') {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

module.exports = {
    createToken,
    decodeToken,
    uploadPictograms
};