'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');

const userSchema = new Schema ({
    email: {type: String, unique: true, lowercase: true,
        validate: {
            validator: function(v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
        required: [true, 'User email required']
    },
    name: {type: String, required: true},
    password: {type: String, select: true, required: true},
    permissions: {type: String, default: 'r'},
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

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('user', userSchema);