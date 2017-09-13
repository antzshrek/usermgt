'use strict';


var hat = require('hat'),
    jwt = require('jwt-simple'),
    _ = require("lodash"),
                Promise = require('bluebird'),
     error_codes = require('./errormessages').error_codes,

    secret = process.env.JWTSECRET;


exports.generateAccessToken = (user) =>
{
	
	if (!_.isObject(user)){
		return Promise.reject(error_codes.TokenError);
	}
// console.log("dal");
	var payload = {
		exp: process.env.JWTEXPIRE,
		iss: process.env.ISSUER, 
		email: user.email,
		userid: user._id,
		salt: hat()
	};
// 	console.log("here");
 	var accessToken = jwt.encode(payload, secret);
    var userRecord = _.omit(user.toObject(), ['password','__updates','updatedAt','createdAt','date_joined','__v']);
     userRecord.access_token = accessToken;

	return userRecord;
};

