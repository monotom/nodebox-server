var crypto = require('crypto');

exports.dateToUnixTime = function(date){
	return Math.round(date.getTime() / 1000);
};

exports.actualUnixTime = function(){
	return exports.dateToUnixTime(new Date());
};

exports.md5 = function(input){
	var hash = crypto.createHash('md5');
	hash.update(pwd);
	return hash.digest('hex');
};

exports.encodePassword = function(pwd){
	return exports.md5(pwd);
};

//TODO generate more complex sessionkeys
exports.uniqueKey = function(secret){
	return exports.md5(secret + ((new Date()).getTime()));
};

exports.isCmd = function(){
	return true; //TODO check environment variables
};