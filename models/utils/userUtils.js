'use strict';
//=============================================================================
/**
 * Module dependencies
 */
//=============================================================================
const User = require('../users'),
     emailManagement = require('../../utils/mstoemailmanagement'),
     verificationCodeUtils = require('./verificationCodeUtils'),
     emailUtils = require('./emailUtils'),
     error_codes = require('../../utils/errorMessages').error_codes,
     log = require('../../helpers/logger').getLogger('UserUtils'),
     jwt = require('../../utils/jwtGenerator'),
     _ = require("lodash");

//=============================================================================
/**
 * module functionality
 */
//=============================================================================

exports.createUser = (properties) => {

    for (var prop in properties) {
        if (properties.hasOwnProperty(prop)) {
            if (!this.validateProperty(prop)) {
                log.error('Invalid Property for User: ' + prop);
                return Promise.reject(error_codes.ResourceNotValid);//ResourceNotValid
            }
        }
    }

    const newUser = new User(properties);
    return newUser.save();


};



exports.validateProperty = property => {


    if (property == '_id') {
        return true;
    }
    return !(typeof User.schema.obj[property] == 'undefined');
};


//login
exports.login = (email, password) => {

    return this.getUserByProperty('email', email)
        .then(user => {
            if (!user) {
                log.debug('User does not exist ' + email);
                return Promise.reject(error_codes.ResourceNotExist);
            }
            else {
                if (!user.isVerified) {
                    return Promise.reject(error_codes.ActionCancelled);
                }
                else if (user.comparePassword(password)) {
                    var jwttoken = jwt.generateAccessToken(user);
                    // console.log(JSON.stringify(userRecord));
                    return jwttoken;
                }
                else {
                    return false;
                }
            }


        }).catch(err => {
            log.error('login ' + email + ' err: ' + JSON.stringify(err));
            return Promise.reject(err);
        });


};

exports.getUserByProperty = (property, value)=> {

    if (!property || !value) {
        return Promise.reject(error_codes.MissingFields); //MissingFields
    }

    if (this.validateProperty(property)) {
        var query = {};
        query[property] = value;
        return User.findOne(query).exec();
    }
    else {
        return Promise.reject(error_codes.ResourceNotValid); //ResourceNotValid
    }

};


exports.forgotPassword = (email) => {

    let globalUser;
    return this.updateUser(email, "isVerified", "false")
        .then(user => {
            globalUser= user;
            return verificationCodeUtils.createCode(user,verificationCodeUtils.types.ForgotPassword, true);
        }).then(code => {
            if (code) {
                
                return emailUtils.getEmailByProperty('templateName', 'forgotPassword')
                    .then(emailSettings => emailUtils.processProperties(emailSettings, globalUser, code));
            }
            else {
                return Promise.reject(error_codes.ResourceNotCreated);
            }
        }).then(emailSetting => {
        	console.log("did i get here?");
            return emailManagement.sendMail(emailSetting);
        })
        .then(result => {
            log.info('forgotPassword Successfully sent email ' + result);
            return globalUser;
        }).catch(err => {
            log.error('forgotPassword ' + email + ' err: ' + JSON.stringify(err));
            return Promise.reject(err);
        });


};




exports.updateUser = (email, property, value) => {

    if (!email || !property || !value) {
        return Promise.reject(error_codes.MissingFields); //MissingFields
    }

    return this.getUserByProperty("email", email)
        .then(user => {
            if (user) {
                if (this.validateProperty(property)) {
                    user[property] = value;
                    return user.save();
                }
                else {
                    return Promise.reject(error_codes.ResourceNotValid);//ResourceNotValid
                }
            }
            else {
                log.error('The user ' + email + ' doesn\'t exist');
                return Promise.reject(error_codes.ResourceNotExist); //UnknownError
            }

        }).then(user => {
            return user;
        }).catch(err => {
            return Promise.reject(err);
        });

};


