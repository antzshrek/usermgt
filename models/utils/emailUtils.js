'use strict';
//=============================================================================
/**
 * Module dependencies
 */
//=============================================================================
const emailSettings = require('../emailSettings'),
    error_codes = require('../../utils/errorMessages').error_codes,
    log = require('../../helpers/logger').getLogger('EmailUtils');

//=============================================================================
/**
 * Module functionality
 */
//=============================================================================

exports.updateEmailSettings = (templateName, property, value) => {

    if (!templateName || !property || !value) {
        return Promise.reject(error_codes.MissingFields); //MissingFields
    }

    return this.getEmailByProperty("templateName", templateName)
        .then(emailSettings => {
            if (emailSettings) {
                if (this.validateProperty(property)) {
                    try{
                        emailSettings[property] = value;
                        return emailSettings.save();
                    }
                    catch(ex) {
                        let error = error_codes.ResourceNotExist;
                        error.msg = ex;
                        return Promise.reject(error);//ResourceNotValid
                    }

                }
                else {
                    return Promise.reject(error_codes.ResourceNotValid);//ResourceNotValid
                }
            }
            else {
                log.error('The emailSettings ' + templateName + ' doesn\'t exist');
                return Promise.reject(error_codes.ResourceNotExist); 
            }

        }).then(emailSettings => {
            return emailSettings;
        }).catch(err => {
            return Promise.reject(err);
        });

};

exports.createEmailSettings = (settings) => {

    if (!settings)
    {
        return Promise.reject(error_codes.MissingFields);
    }

    for (var prop in settings) {
        if (settings.hasOwnProperty(prop)) {
            if (!this.validateProperty(prop)) {
                log.error('Invalid Property for Email Settings: ' + prop);
                return Promise.reject(error_codes.ResourceNotValid);
            }
        }
    }

    log.debug('Creating emails settings for ' + JSON.stringify(settings.templateName));

    var email = new emailSettings(settings);
    return email.save();

};

exports.deleteEmail = (property,value) => {

    if (!property || !value)
    {
        return Promise.reject(error_codes.MissingFields);
    }

    if (this.validateProperty(property))
    {
        var query={};
        query[property]= value;
        return emailSettings.findOneAndRemove(query).exec();
    }
    else {
        return Promise.reject(error_codes.ResourceNotValid);
    }

};


exports.getEmailByProperty = (property,value)=> {

    if (!property || !value)
    {
        return Promise.reject(error_codes.MissingFields);
    }


    if (this.validateProperty(property))
    {
        var query={};
        query[property]= value;
        return emailSettings.findOne(query).exec();
    }
    else {
        return Promise.reject(error_codes.ResourceNotValid);
    }

};



exports.validateProperty =  property => {
    if (property=='_id')
    {
        return true;
    }
    return !(typeof emailSettings.schema.obj[property] == 'undefined');
};

/*
 Properties need to be valid json with quotes
 {
 "templateName": "RegistrationWithCode",
 "property":"bodyProperties",
 "value": "{\"URL\": \"http://localhost:3032/verification/\"}"
 }
 */
exports.processProperties = (settings, user, code) => {
    if (settings) {
        try {
            let  newSettings = settings.toObject(),
                emailbody = {};

                var f = Object.keys(newSettings.bodyProperties);
    console.log("settings objeci " + JSON.stringify(f) );
            if (typeof newSettings.bodyProperties != 'undefined' && newSettings.bodyProperties) {
                emailbody = newSettings.bodyProperties;
                let keys = Object.keys(emailbody);
                if (keys.length > 0 && keys.indexOf("URL") > -1) {
                    emailbody.URL = emailbody.URL.toString() + code.code.toString();
                }
            }

            emailbody.user = user.first_name;
            newSettings.emailbody = emailbody;
            newSettings.to = user.email;
            newSettings.content = emailbody.URL; //to be corrected

            log.debug("Processed email " + JSON.stringify(newSettings));

            return newSettings;
        } catch (ex) {
            log.error("error processing properties " + ex);//UnknownError
            return Promise.reject(error_codes.UnknownError);
        }
    }
    else {
        return Promise.reject(error_codes.ResourceNotExist);//ResourceNotExist

    }
};