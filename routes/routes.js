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
    userUtils.login(req.body.email, req.body.password)
        .then(result => {
            log.debug('/login ' + JSON.stringify(result));
            return res.status(200).json(result);
        }).catch(err=> {
        let error = errormessages.processError(err);
        log.error('/login ' + JSON.stringify(error));
        return res.status(error.code).json(error.msg);

    })
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
//=============================================================================
/**
 * Export Router
 */
//=============================================================================
module.exports = router;
//=============================================================================