'use strict';
//=============================================================================
/**
 * Module dependencies
 */
//=============================================================================
const
    mongoose = require('mongoose'),
    trackable = require('mongoose-trackable'),
uniqueValidator = require('mongoose-beautiful-unique-validation');

    mongoose.Promise = require('bluebird');

//=============================================================================
/**
 * EmailSettingsSchema Schema
 */
//=============================================================================
const EmailSettingsSchema = new mongoose.Schema({
    templateName: {
        type: String,
        required: [true, 'Please add a template name'],
        index: true,
        unique: true
    },
    transport: {
        type: String,
        required: [true, 'Please add transport']
    },
    from: {
        type: String,
        required: [true, 'Please add a from address']
    },
    subject: {
        type: String
    },
    bodyProperties: {
        type: mongoose.Schema.Types.Mixed,
        default:{}
    }
}).plugin(trackable).plugin(uniqueValidator);





//=============================================================================
/**
 * Schema methods
 */
//=============================================================================

//=============================================================================
/**
 * Compile to Model
 */
//=============================================================================
const EmailSettingsModel = mongoose.model('EmailSettings', EmailSettingsSchema);
//=============================================================================
/**
 * Export  Model
 */
//=============================================================================
module.exports = EmailSettingsModel;
//=============================================================================
