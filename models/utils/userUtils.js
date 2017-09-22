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
     totpManagement = require('../../utils/totpManagement'),
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
// exports.login = (email, password) => {

//     return this.getUserByProperty('email', email)
//         .then(user => {
//             if (!user) {
//                 log.debug('User does not exist ' + email);
//                 return Promise.reject(error_codes.ResourceNotExist);
//             }
//             else {
//                 if (!user.isVerified) {
//                     return Promise.reject(error_codes.ActionCancelled);
//                 }
//                 else if (user.comparePassword(password)) {
//                     var jwttoken = jwt.generateAccessToken(user);
//                     // console.log(JSON.stringify(userRecord));
//                     return jwttoken;
//                 }
//                 else {
//                     return false;
//                 }
//             }


//         }).catch(err => {
//             log.error('login ' + email + ' err: ' + JSON.stringify(err));
//             return Promise.reject(err);
//         });


// };


exports.enableTotpById =(userID) =>{
    return this.getUserByProperty('_id', userID)
        .then(user =>{
            if(!user){
                log.debug('User does not exist' + userID);
            }else{
                if(!user.isVerified){
                    return Promise.reject(error_codes.ActionCancelled);
                }else{
                    return totpManagement.enableTotp(user._id)
                        .then(response =>{
                            return response;
                        }).catch(err => {
                            return Promise.reject(error_codes.ActionCancelled);
                        });
                }
            }

        }).catch(err =>{
                        return Promise.reject(err);
        });

};

exports.enableTotpByEmail =(userEmail) =>{
    return this.getUserByProperty('email', userEmail)
        .then(user =>{
            if(!user){
                log.debug('User does not exist' + userEmail);
            }else{
                if(!user.isVerified){
                    return Promise.reject(error_codes.ActionCancelled);
                }else{
                    return totpManagement.enableTotp(user._id)
                        .then(response =>{
                            return response;
                        }).catch(err => {
                            return Promise.reject(error_codes.ActionCancelled);
                        });
                }
            }

        }).catch(err =>{
                        return Promise.reject(err);
        });

};


exports.getTotpByEmail =(userEmail) =>{
    return this.getUserByProperty('email', userEmail)
        .then(user =>{
            if(!user){
                log.debug('User does not exist' + userEmail);
            }else{
                if(!user.isVerified){
                    return Promise.reject(error_codes.ActionCancelled);
                }else{
                    return totpManagement.sendTotp(user._id)
                        .then(response =>{
                            return response;
                        }).catch(err => {
                            return Promise.reject(error_codes.ActionCancelled);
                        });
                }
            }

        }).catch(err =>{
                        return Promise.reject(err);
        });

};


exports.getTotpById =(userId) =>{
    return this.getUserByProperty('_id', userId)
        .then(user =>{
            if(!user){
                log.debug('User does not exist' + userId);
            }else{
                if(!user.isVerified){
                    return Promise.reject(error_codes.ActionCancelled);
                }else{
                    return totpManagement.sendTotp(user._id)
                        .then(response =>{
                            return response;
                        }).catch(err => {
                            return Promise.reject(error_codes.ActionCancelled);
                        });
                }
            }

        }).catch(err =>{
                        return Promise.reject(err);
        });

};


exports.disableTotpById =(userId) =>{
    return this.getUserByProperty('_id', userId)
        .then(user =>{
            if(!user){
                log.debug('User does not exist' + userId);
            }else{
                if(!user.isVerified){
                    return Promise.reject(error_codes.ActionCancelled);
                }else{
                    return totpManagement.disableTotp(user._id)
                        .then(response =>{
                            return response;
                        }).catch(err => {
                            return Promise.reject(error_codes.ResourceNotValid);
                        });
                }
            }

        }).catch(err =>{
                        return Promise.reject(err);
        });

};

exports.disableTotpByEmail =(userEmail) =>{
    return this.getUserByProperty('email', userEmail)
        .then(user =>{
            if(!user){
                log.debug('User does not exist' + userEmail);
            }else{
                if(!user.isVerified){
                    return Promise.reject(error_codes.ActionCancelled);
                }else{
                    return totpManagement.disableTotp(user._id)
                        .then(response =>{
                            return response;
                        }).catch(err => {
                            return Promise.reject(error_codes.ResourceNotValid);
                        });
                }
            }

        }).catch(err =>{
                        return Promise.reject(err);
        });

};


exports.login = (userCredentials) => {
    if(userCredentials.hasOwnProperty('totp'))
    {
        console.log("totp");
        return this.totpLogin(userCredentials);
    }else{
        console.log("no totp");
        return this.normalLogin(userCredentials);
    }

};

exports.normalLogin =(creds) =>{
console.log("see me " + JSON.stringify(creds));
    return this.getUserByProperty('email', creds.email)
        .then(user => {
            if (!user) {
                log.debug('User does not exist ' + creds.email);
                return Promise.reject(error_codes.ResourceNotExist);
            }
            else {
                if (!user.isVerified) {
                    return Promise.reject(error_codes.ActionCancelled);
                }
                else if (user.comparePassword(creds.password)) {
                    var jwttoken = jwt.generateAccessToken(user);
                    // console.log(JSON.stringify(userRecord));
                    return jwttoken;
                }
                else {
                    return false;
                }
            }

        }).catch(err => {
            log.error('login ' + creds.email + ' err: ' + JSON.stringify(err));
            return Promise.reject(err);
        });
};

exports.totpLogin = (creds) =>{
 return this.getUserByProperty('email', creds.email)
        .then(user => {
            if (!user) {
                log.debug('User does not exist ' + creds.email);
                return Promise.reject(error_codes.ResourceNotExist);
            }
            else {
                if (!user.isVerified) {
                    return Promise.reject(error_codes.ActionCancelled);
                }
                else if (user.comparePassword(creds.password)) {
                    //console.log("yipee " + totpManagement.verifyTotp(user._id, creds.totp));

                    return totpManagement.verifyTotp(user._id, creds.totp)
                        .then(response =>{
                            if(response === true)
                            {
                                var jwttoken = jwt.generateAccessToken(user);
                                return jwttoken;
                            }else{
                                return Promise.reject(error_codes.NoRecord);
                            }
                        }).catch(err => {
                            // console.log("see error " + err.message);
                            return Promise.reject(error_codes.ActionCancelled);
                        });
                }
                else {
                     return Promise.reject(error_codes.NoRecord);
                }
            }

        }).catch(err => {
            log.error('login ' + creds.email + ' err: ' + JSON.stringify(err));
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


