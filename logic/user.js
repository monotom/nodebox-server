var util    = require("../logic/util"),
	log		= util.getLogger('logic.user::');

/**
* @author Tom Hanoldt
* @class The logical user object.
* 
* @param data An object containig the data from the concrete user.
* @param model The model used to store the users data.
*/
var User = function(data, model){
	for(var key in data){ 
		this[key] = data[key];
	};
	
	/**
	* Encodes and sets the user password.
	*                  
	* @param password The plain text password.
	*
	* @return void
	*/
	this.setPassword = function(password){
		this.password = util.md5(password);	
	};
	
	/**
	* Matches a password to the stored user password.
	*                  
	* @param password The plain text password to match against the user password.
	*
	* @return Boolean True if the passwords match, false otherwise.
	*/
	this.checkPassword = function(password){
		return this.password == util.md5(password);	
	};
	
	/**
	* Save the user object.
	*                  
	* @param callback The callback method called when the operation finished. Parameter passed to the callback method is error if there is one.
	*
	* @return void
	*/
	this.save = function(callback){
		model.update(this._id, { name 			: this.name || 'DefaultName',
								 password 		: this.password || '',
								 lastActivity 	: util.actualUnixTime()}, callback);
	};
	
	/**
	* Delete the user object.
	*                  
	* @param callback The callback method called when the operation finished. Parameter passed to the callback method is error if there is one.
	*
	* @return void
	*/
	this.remove = function(callback){
		model.remove(this._id, callback);
	};
};

exports.User = User;