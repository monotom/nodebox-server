var crypto = require('crypto');

exports.dateToUnixTime = function(date){
	return Math.round(date.getTime() / 1000);
};

exports.actualUnixTime = function(){
	return exports.dateToUnixTime(new Date());
};

exports.md5 = function(input){
	var hash = crypto.createHash('md5');
	hash.update(''+input);
	return hash.digest('hex');
};

exports.encodePassword = function(pwd){
	return exports.md5(pwd);
};

exports.uniqueKey = function(secret){
	return exports.md5(secret + ((new Date()).getTime()));
};

exports.escapeRegExp = function(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

exports.mixin = function(obj1, obj2){
	for(var k in obj2)
		obj1[k] = obj2[k];
	return obj1;
};

exports.bytesToHumanReadable = function (filesize) {
	if (filesize >= 1073741824) 
	     return exports.numberFormat(filesize / 1073741824, 2, '.', '') + ' Gb';
	
	if (filesize >= 1048576) 
     	return exports.numberFormat(filesize / 1048576, 2, '.', '') + ' Mb';
	 
	if (filesize >= 1024) 
		return exports.numberFormat(filesize / 1024, 0) + ' Kb';
			
	return exports.numberFormat(filesize, 0) + ' bytes';
};

exports.numberFormat = function  (number, decimals, dec_point, thousands_sep) {
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
	    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	    s = '',
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
