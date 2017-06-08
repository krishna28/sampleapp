'use strict'

//module used to make http request
var request = require('request'); 
//configuration object
var config = require('./../../config');


/**
 * @name getHistorical
 * @description
 *  service function to get historical data
 * @param date format(yyyy-mm--dd)
 * @param cb a callback function
 */
var getHistorical = function getHistorical(date,cb){

	var dateString = date.concat(".json");
	var url = config.basepath.concat('historical/').concat(dateString).concat("?app_id=").concat(config.apikey);
	request(url, function (error, response, body) {
	  cb(error,response,body); //callback function
	});
   
}
/**
 * @name getCurrencies
 * @description
 *  service function to get list of currencies data
 * @param cb a callback function
 */

var getCurrencies = function getCurrencies(cb){

	var url = config.basepath.concat('/').concat('currencies.json').concat("?app_id=").concat(config.apikey);
	request(url, function (error, response, body) {
	  cb(error,response,body); // callback function 
	});

}
/**
 * @name getLatest
 * @description
 *  service function to get latest exchange rate wiith base currency set as USD
 * @param cb a callback function
 */
var getLatest = function getLatest(cb){
	var url = config.basepath.concat('/').concat('latest.json').concat("?app_id=").concat(config.apikey);
	request(url, function (error, response, body) {
	  cb(error,response,body); // callback function
	});

}

/**
 * @description
 * Service object to expose required functions
 */

var serviceObject = {
	"getLatest":getLatest,	
	"getHistorical":getHistorical,
	"getCurrencies":getCurrencies
}

/**
 * @description
 * used to expose the methods
 */
module.exports = serviceObject