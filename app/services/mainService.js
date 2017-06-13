'use strict'

//module used to make http request
var request = require('request'); 
//promise support for request
var rp = require('request-promise');
const tenant = 'melco';
const appId = 'GoVerifyID';




//FIRST GET THE TOKEN FOR MAKING REQUEST
var getToken = function getToken(config,cb){
	const url = config.basepath.concat("usermanager/oauth/token");
	const auth_key = "Basic ".concat(config.authorization_key);
	console.log("Auth key is",auth_key);
	const a_scope = 'SCOPE_TENANT_ADMIN';
	const a_grant_type = 'client_credentials';

	const options = {
		method: 'POST',  
		uri: url,
		form: {
			scope: a_scope,
			grant_type:a_grant_type
		},
		headers: {
			'User-Agent': 'request',
			'Content-Type':'application/x-www-form-urlencoded',
			'Authorization': auth_key
		},
		json:true
	}

	rp(options)
	.then(function (body) {
		cb(body);
	})
	.catch(function (err) {
		console.log("The getToken: request failed with err",err);
	});

}



//GET USER DETAILS FROM USERID
var getUserDetails = function getUserDetails(config,access_token,userId,cb){

    // get user details from the userid
    //https://gmi-apac.iwsinc.com/gmiserver/person?userId=krishnakantsingh@melco-resorts.com
    const url = config.basepath.concat("gmiserver/person");
    const auth_key = "Bearer ".concat(access_token);
    console.log("Auth key is",auth_key);
    const options = {
    	method: 'GET',  
    	uri: url,
    	qs:{
    		userId:userId
    	},
    	headers: {
    		'User-Agent': 'request',
    		'Content-Type':'application/x-www-form-urlencoded',
    		'Authorization': auth_key
    	},
    	json:true
    }
    rp(options)
    .then(function (body,res) {
    	console.log(body);
    	console.log("Res is ",res);
    	cb(null,body);
    })
    .catch(function (err) {
    	console.log("The getUserDetails: request failed with err",err);
    });


}


//send final alert to the user

var sendAlert = function sendAlert(g_object,cb){

	var formData = {
		"maxResponseAttempts":3, 
		"postbackUrl":"https://young-sands-51742.herokuapp.com/api/handleResponse", 
		"template" : g_object.vtype,
		"metadata":{"reason":"Unusual activity detected."},
		"expiresIn":180
	}

	const auth_key = "Bearer ".concat(g_object.authToken);
	console.log("The auth key is", auth_key);

	const options = {
		method: 'POST',  
		uri: g_object.url,
		body:formData,
		headers: {
			'User-Agent': 'request',
			'Content-Type':'application/json',
			'Authorization': auth_key
		},
		json:true
	}
	console.log("Details of option object ",options);
	rp(options)
	.then(function (body,res) {
		console.log(body);
		console.log("Res is ",res);
		cb(null,body);
	})
	.catch(function (err) {
		console.log("The getUserDetails: request failed with err",err);
	});




}




/**
 * @name verify
 * @description get user details
 * @param userid
 * @param verification Type 
 * @param cb a callback function
 */
 var verify = function verify(reqObject,config,cb){

 	getToken(config,function(response){
 		console.log("Yes the token is fetched",response.access_token);

 		getUserDetails(config,response.access_token,reqObject.userId,function(err,body){
 			var g_object = {};
 			g_object.id=body.id;
 			g_object.vtype= reqObject.vtype;
 			var vtype_sub = reqObject.vtype.split("/")[reqObject.vtype.split("/").length-1];
 			const url = config.basepath.concat("gmiserver/tenant/").concat(tenant).concat("/app/").concat(appId).concat("/template/").concat(vtype_sub).concat("/person/").concat(body.id).concat("/message");
 			g_object.url=url;
 			g_object.authToken = response.access_token;
 			sendAlert(g_object,function(err,body){
 				console.log("Final response received ",body);
 				cb(err,body);
 			});

 		});
 	});
 }

/**
 * @description
 * Service object to expose required functions
 */

 var serviceObject = {
 	"verify":verify
 }

/**
 * @description
 * used to expose the methods
 */
 module.exports = serviceObject