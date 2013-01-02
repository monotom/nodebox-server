var crypto = require('crypto');

/**
* Converts a java script Date object to a unix time stamp.
*                  
* @param date A object from class Date.
*
* @return int Unix time stamp. Seconds since 1.1.1970.
*/
var dateToUnixTime = function(date){
	return Math.round(date.getTime() / 1000);
};

/**
* Gives the unix time stamp from now.
*
* @return int Unix time stamp. Seconds since 1.1.1970.
*/
var actualUnixTime = function(){
	return dateToUnixTime(new Date());
};

/**
* Calculates the md5 representation of a string.
*                  
* @param input The string that should be converted. 
*
* @return String The md5 representation of input.
*/
var md5 = function(input){
	var hash = crypto.createHash('md5');
	hash.update(''+input);
	return hash.digest('hex');
};

/**
* Calculates a simple unique key based on a secret phrase, actual date and an random value.
*                  
* @param secret The secret phrase used to generate the unique key. 
*
* @return String A md5 encoded unique key.
*/
var uniqueKey = function(secret){
	return exports.md5(secret + ((new Date()).getTime()) + '' +(Math.random() * 0x10000) );
};

/**
* Mixes object properties and methods from one object into an other. 
*                  
* @param obj1 The target object where the properties and methods are mixed in.
* @param obj2 The source object where the properties and methods come from.
*
* @return Object A reference to obj1 parameter.
*/
var mixin = function(obj1, obj2){
	for(var k in obj2)
		obj1[k] = obj2[k];
	return obj1;
};

/**
* Converts a byte count to a human readable format.
*                  
* @param filesize The size of a file in bytes.
*
* @return String A human readable form of the file size.
*/
var bytesToHumanReadable = function (filesize) {
	if (filesize >= 1073741824) 
	     return numberFormat(filesize / 1073741824, 2, '.', '') + ' Gb';
	
	if (filesize >= 1048576) 
     	return numberFormat(filesize / 1048576, 2, '.', '') + ' Mb';
	 
	if (filesize >= 1024) 
		return numberFormat(filesize / 1024, 0) + ' Kb';
			
	return numberFormat(filesize, 0) + ' bytes';
};

/**
* Converts given number with decimal points an thousands separator.
*                  
* @param number The number to format.
* @param decimal Count of decimal signs.
* @param dec_point The sign used to cut the decimal part.
* @param thousands_sep The thousands separator sign.
*
* @return String The formatted number.
*/
var numberFormat = function  (number, decimals, dec_point, thousands_sep) {
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
	    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	    s = '',
	    /**@private*/
	    toFixedFix = function (n, prec) {
	    	var k = Math.pow(10, prec);
	    	return '' + Math.round(n * k) / k;
	    };
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
	    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
	    s[1] = s[1] || '';
	    s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
};

/**
* Get a method for logging to the console.
*                  
* @param prefix The prefix prepended to each log line.
*
* @return Method A method getting one string parameter and if called logs the message with prepended prefix to the console.
*/
var getLogger = function(prefix){
	prefix = prefix || '';
	return function(msg){
		console.log(prefix+msg);
	};
};

exports.dateToUnixTime = dateToUnixTime;
exports.actualUnixTime = actualUnixTime;
exports.md5 = md5;
exports.uniqueKey = uniqueKey;
exports.mixin = mixin;
exports.bytesToHumanReadable = bytesToHumanReadable;
exports.numberFormat = numberFormat;
exports.getLogger = getLogger;