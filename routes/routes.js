'use strict';
//=============================================================================
/**
 * Module dependencies
 */
//=============================================================================
const
    express = require('express'),
    userUtils = require('../models/utils/userUtils'),
    emailUtils = require('../models/utils/emailUtils'),
    verificationUtils = require('../models/utils/verificationCodeUtils'),
    errormessages = require('../utils/errorMessages'),
    log = require('../helpers/logger').getLogger('ROUTES');

//=============================================================================
/**
 * Router instance
 */
//=============================================================================
const router = express.Router();
//=============================================================================
/**
 * API Routes
 */
//=============================================================================
//=============================================================================
/**
 * User Routes
 */
//=============================================================================

router.post('/createUser', (req, res) => {
    userUtils.createUser(req.body.user)
        .then(user => {
            log.info('Successfully created user ' + user.email);
            return res.status(200).json(user.email);
        }).catch(err => {
        log.error('/createUser err ' + JSON.stringify(err));
        let error = errormessages.processError(err);
        return res.status(error.code).json(error.msg);
    })

});

//used on login page
router.post('/login', (req, res) => {
    userUtils.login(req.body)
        .then(result => {
            log.debug('/login ' + JSON.stringify(result));
            return res.status(200).json(result);
        }).catch(err=> {
        let error = errormessages.processError(err);
        log.error('/login ' + JSON.stringify(error));
        return res.status(error.code).json(error.msg);

    })
});


router.post('/enableTotpById', (req,res) => {
    userUtils.enableTotpById(req.body.uid)
        .then(result =>{
            log.debug('/enableTotpById ' + JSON.stringify(result));
            return res.status(200).json(result);
        }).catch(err=> {
            let error = errormessages.processError(err);
            log.error('/enableTotpById ' + JSON.stringify(error));
            return res.status(error.code).json(error.msg);
        });
});


router.post('/enableTotpByEmail', (req,res) => {
    userUtils.enableTotpByEmail(req.body.email)
        .then(result =>{
            log.debug('/enableTotpByEmail ' + JSON.stringify(result));
            return res.status(200).json(result);
        }).catch(err=> {
            let error = errormessages.processError(err);
            log.error('/enableTotpByEmail ' + JSON.stringify(error));
            return res.status(error.code).json(error.msg);
        });
});


router.post('/getTotpByEmail', (req, res) =>{
    userUtils.getTotpByEmail(req.body.email)
        .then(result =>{
            log.debug('/getTotpByEmail ' + JSON.stringify(result));
            return res.status(200).json(result);
        }).catch(err=> {
            let error = errormessages.processError(err);
            log.error('/getTotpByEmail ' + JSON.stringify(error));
            return res.status(error.code).json(error.msg);
        });    
});


router.post('/getTotpById', (req, res) =>{
    userUtils.getTotpById(req.body.uid)
        .then(result =>{
            log.debug('/getTotpById ' + JSON.stringify(result));
            return res.status(200).json(result);
        }).catch(err=> {
            let error = errormessages.processError(err);
            log.error('/getTotpById ' + JSON.stringify(error));
            return res.status(error.code).json(error.msg);
        });    
});

router.post('/disableTotpById', (req, res) =>{
    userUtils.disableTotpById(req.body.uid)
        .then(result =>{
            log.debug('/disableTotpById ' + JSON.stringify(result));
            return res.status(200).json(result);
        }).catch(err=> {
            let error = errormessages.processError(err);
            log.error('/disableTotpById ' + JSON.stringify(error));
            return res.status(error.code).json(error.msg);
        });    
});


router.post('/disableTotpByEmail', (req, res) =>{
    userUtils.disableTotpByEmail(req.body.email)
        .then(result =>{
            log.debug('/disableTotpByEmail ' + JSON.stringify(result));
            return res.status(200).json(result);
        }).catch(err=> {
            let error = errormessages.processError(err);
            log.error('/disableTotpByEmail ' + JSON.stringify(error));
            return res.status(error.code).json(error.msg);
        });    
});


router.post('/forgotPassword', (req, res) => {
    userUtils.forgotPassword(req.body.email)
        .then(user => {
            return res.status(200).json(user);
        }).catch(err=> {
        let error = errormessages.processError(err);
        return res.status(error.code).json(error.msg);
    })
});



//=============================================================================
/**
 * Email Settings Routes
 */
//=============================================================================
router.get('/getEmailSettings', (req, res) => {

    emailUtils.getEmailByProperty(req.query.property, req.query.value)
        .then(emailsetting => {
            log.info('Successfully retrieved email setting:  ' + emailsetting.templateName);
            return res.status(200).json(emailsetting);
        }).catch(err => {
        log.error('/getEmailSettings err ' + JSON.stringify(err));

        let error = errormessages.processError(err);
        return res.status(error.code).json(error.msg);
    });

});

router.post('/createEmailSettings', (req, res) => {

    emailUtils.createEmailSettings(req.body)
        .then(emailsetting => {
            log.info('Successfully created email settings: ' + emailsetting.templateName);
            return res.status(200).json(emailsetting.templateName);
        }).catch(err => {
        log.error("ERROR EMAIL " + JSON.stringify(err));
        let error = errormessages.processError(err);
        log.error('/createEmailSettings err ' + JSON.stringify(error));

        return res.status(error.code).json(error.msg);
    })

});

router.put('/updateEmailSettings', (req, res) => {

    emailUtils.updateEmailSettings(req.body.templateName, req.body.property, req.body.value)
        .then(value => {
            log.debug('successfully updated to ' + JSON.stringify(value));
            return res.status(200).json(value);
        }).catch(err => {
        let error = errormessages.processError(err);
        log.error('/updateEmailSettings err ' + JSON.stringify(error));

        return res.status(error.code).json(error.msg);

    });
});

router.put('/updateUser', (req, res) => {

    if (Array.isArray(req.body.property) && Array.isArray(req.body.value)) {
        userUtils.updateUserByProperties(req.body.email, req.body.property, req.body.value)
            .then(value => {
                log.debug('successfully updated to ' + JSON.stringify(value));
                return res.status(200).json(value);
            }).catch(err => {
            log.error('/updateUser err ' + JSON.stringify(err));
            let error = errormessages.processError(err);
            return res.status(error.code).json(error.msg);

        });
    }
    else {
        userUtils.updateUser(req.body.email, req.body.property, req.body.value)
            .then(value => {
                log.debug('successfully updated to ' + JSON.stringify(value));
                return res.status(200).json(value);
            }).catch(err => {
            let error = errormessages.processError(err);
            log.error('/updateUser err ' + JSON.stringify(error));
            return res.status(error.code).json(error.msg);

        });
    }
});



router.delete('/deleteUser', (req, res) => {

    userUtils.deleteUser(req.body.property, req.body.value).then(user=> {
        if (user)
        {
            log.info('Successfully deleted ' + JSON.stringify(user));
            return res.status(200).json(user.email);
        }
        else {
            log.error('Could not find user to delete');

            let error= errormessages.error_codes.ResourceNotExist;
            return res.status(error.code).json(error.msg);
        }


    }).catch(err => {
        let error = errormessages.processError(err);
        log.error('/deleteUser err ' + JSON.stringify(error));

        return res.status(error.code).json(error.msg);

    });

});
//=============================================================================
/**
 * Export Router
 */
//=============================================================================
module.exports = router;
//=============================================================================