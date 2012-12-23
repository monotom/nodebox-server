
exports.File = function(data){
	for(var key in data){ 
		this[key] = data[key];
	}
};