'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema ({
    email: {type: String, unique: true, lowercase: true},
    name: String,
    password: String,
    signupDate: {type: Date, default: Date.now()},
    lastLogin: Date
});

userSchema.pre('save', function(next) {
   let user = this;
   if(!user.isModified('password')) return next();

   bcrypt.genSalt(10, (err, salt) => {
       if (err) return next(err);
       bcrypt.hash(user.password, salt, null, (err, hash) =>{
           if(err) return next(err);
           user.password = hash;
           next()
       })
   })
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('user', userSchema);