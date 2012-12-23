var util     = require("../logic/util");

var log = function(msg){
	console.log('logic.user::'+msg);
};

User = function(data, model){
	for(var key in data){ 
		this[key] = data[key];
	};
	
	this.getData = function(){
		return { name 			: this.name || 'DefaultName',
				 password 		: this.password || '',
				 lastActivity 	: util.actualUnixTime()};	
	};
	
	this.setPassword = function(password){
		this.password = util.encodePassword(password);	
	};
	
	this.checkPassword = function(password){
		return this.password == util.encodePassword(password);	
	};
	
	this.save = function(callback){
		model.update(this._id, this.getData(), callback);
	};
	
	this.remove = function(callback){
		model.remove(this._id, callback);
	};
};

exports.User = User;