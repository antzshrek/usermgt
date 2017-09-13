'use strict';
//=============================================================================
/**
 * Module dependencies
 */
//=============================================================================
const verificationCode = require('../verificationCode'),
    log = require('../../helpers/logger').getLogger('VerificationCodeUtils'),
    userUtils = require('./userUtils'),
    error_codes = require('../../utils/errormessages').error_codes;


exports.types = {
    "VerifyEmail":"verifyEmail",
    "ForgotPassword": "forgotPassword"
};
//=============================================================================
/**
 * Module functionality
 */
//=============================================================================
exports.createCode = (user,type, nonce) => {
    log.debug('Creating code for ' + user.username);

    if (!user || !type)
    {
        return Promise.reject(error_codes.MissingFields);

    }

    return verificationCode.findOneAndRemove({type:type,"user": user._id})
            .exec()
            .then(usr=> {
                if (usr) {
                    log.debug("Successfully deleted code for " + JSON.stringify(usr));
                }
                
                let code = new verificationCode({user: user, type: type});
                code.generateCode();
                if (nonce)
                {
                    code.generateNonce();
                }
                return code.save();
            }).catch(err=>
            {
                return Promise.reject(err);
            });


};


exports.getCodeByProperty = (property, value) => {

    if (!property || !value) {
        return Promise.reject(error_codes.MissingFields);
    }

    if (this.validateProperty(property)) {
        var query = {};
        query[property] = value;
        return verificationCode.findOne(query).exec();
    }
    else {
        return Promise.reject(error_codes.ResourceNotValid);
    }

};


exports.verifyEmail = (code) => {

    let globalCode;
    if (!code)
    {
        return Promise.reject(error_codes.MissingFields);

    }
    return this.getCodeByProperty('code', code)
        .then(code => {

            if (!code) {
                return Promise.reject(error_codes.ResourceNotExist);
            }
            globalCode= code;
            return userUtils.getUserByProperty('_id',code.user);

        }).then(user=>
        {
            if (user.isVerified) {
                return Promise.reject(error_codes.ActionCancelled);
            }
            else {
                let globalUser = user.toObject();
                globalUser.code = globalCode;
                return globalUser;
            }
        });
};

exports.validateProperty = property => {
    if (property=='_id')
    {
        return true;
    }
    return !(typeof verificationCode.schema.obj[property] == 'undefined');
};