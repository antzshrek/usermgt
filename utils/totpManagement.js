'use strict';


var rp = require('request-promise'),
    totpmanagement = process.env.TOTPMICROSERVICE;


exports.verifyTotp= (userid, totp) =>
{
    var personalizations = {
    		"uid":userid,
			"token": totp
    };

    let options = {
        method: 'POST',
        headers: {
       "Content-Type": "application/json"
    	},
        uri:totpmanagement + '/verifyOtp',
        body: personalizations,
        json:true
    };
    
     return rp(options);
};

exports.enableTotp= (userid) =>
{
    var personalizations = {
    		"uid":userid,
    };

    let options = {
        method: 'POST',
        headers: {
       "Content-Type": "application/json"
    	},
        uri:totpmanagement + '/enableOtp',
        body: personalizations,
        json:true
    };
    
     return rp(options);
};


exports.sendTotp= (userid) =>
{
    var personalizations = {
    		"uid":userid,
    };

    let options = {
        method: 'POST',
        headers: {
       "Content-Type": "application/json"
    	},
        uri:totpmanagement + '/getTotp',
        body: personalizations,
        json:true
    };
    
     return rp(options);
};


exports.disableTotp= (userid) =>
{
    var personalizations = {
    		"uid":userid,
    };

    let options = {
        method: 'DELETE',
        headers: {
       "Content-Type": "application/json"
    	},
        uri:totpmanagement + '/disableTotp',
        body: personalizations,
        json:true
    };
    
     return rp(options);
};