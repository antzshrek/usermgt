'use strict';
//=============================================================================
/**
 * Module dependencies
 */
//=============================================================================
const
    mongoose = require('mongoose'),
    randtoken = require('rand-token'),
    nonce = require('nonce')(),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-beautiful-unique-validation'),
    trackable = require('mongoose-trackable');

    mongoose.Promise = require('bluebird');

//=============================================================================
/**
 * VerificationCode Schema
 */
//=============================================================================
const VerificationCodeSchema = new mongoose.Schema({
    user: {
        type:  Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nonce: {
        type: String
    },
    code: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true, default: Date.now,
        expires: '30m'
    },
    type: {
        type: String
    }

}).plugin(trackable).plugin(uniqueValidator);

VerificationCodeSchema.index({user:1,type:1}, {unique:true});

VerificationCodeSchema.methods.generateCode = function()
{
       return this.code = randtoken.generate(8);

};

VerificationCodeSchema.methods.generateNonce = function()
{
    return this["nonce"] = nonce();

};


//=============================================================================
/**
 * Compile to Model
 */
//=============================================================================
const VerificationCodeModel = mongoose.model('VerificationCode', VerificationCodeSchema);
//=============================================================================
/**
 * Export Model
 */
//=============================================================================
module.exports = VerificationCodeModel;
//=============================================================================