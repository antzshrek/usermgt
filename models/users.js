'use strict';
//=============================================================================
/**
 * Module dependencies
 */
//=============================================================================
const
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    trackable = require('mongoose-trackable'),
    uniqueValidator = require('mongoose-beautiful-unique-validation'),
    SALT_WORK_FACTOR = 10;

mongoose.Promise = require('bluebird');

//=============================================================================
/**
 * User Schema
 */
//=============================================================================
const UserSchema = new mongoose.Schema({
  
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    password: {
        type: String,
        required: [true,'Please add a password']
    },
    email: {
        type: String,
        required: [true,'Please add an email address'],
        unique: true
    },
    otpsecret:{
        type: String
    },
    isVerified: {
        type: Boolean
    },
    isActive: {
        type: Boolean
    },
    isAdmin: {
        type: Boolean
    },
    filters: {
        type: Array
    },
    lastActiveOn: {
        type: Date
    },
    date_joined: {
        type: Date,
        default: Date.now,
        required: true
    }
}).plugin(trackable,{fieldsToTrack: ['email']}).plugin(uniqueValidator);
//=============================================================================
/**
 * Implement indexing
 */
//=============================================================================
UserSchema.index({email:1}, {unique:true});
//=============================================================================
/**
 * Schema methods
 */
//=============================================================================
UserSchema.pre('save', function(next)  {
    var user = this;
    
    if (user.isModified('password'))
    {
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt)  {
            if (err) return next(err);

            bcrypt.hash(user.password, salt,function () {},function(err, hash){
                if (err) return next(err);

                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }



});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);

};

UserSchema.methods.setActive = function(active){
    this.isActive = active;
    return this;
};

UserSchema.methods.wasActive = function(){
    this.lastActiveOn = new Date();
    return this;
};
//=============================================================================
/**
 * Compile to Model
 */
//=============================================================================
const UserModel = mongoose.model('User', UserSchema);
//=============================================================================
/**
 * Export  Model
 */
//=============================================================================
module.exports = UserModel;
//=============================================================================