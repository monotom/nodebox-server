var moo      = require('mootools'),
    logger   = require("../server/log").log,
    protocol = require("../server/protocol"),
    Item     = require("../logic/item").Item,
    config   = require("../config"),
    storage  = require("../logic/storage").user,
    util     = require("../logic/util");

var log = function(msg){
	logger("User."+msg);
};

User = function(data){
	for(var key in data){ 
		this[key] = data[key];
	};
};

User.prototype.id;
User.prototype.sessionKey;
User.prototype.name = "DefaultUsername";
User.prototype.password = '';
User.prototype.lastActivity = 0;
User.prototype.state = "UserStateNew";
User.validStates = ["UserStateNew", "UserStatePersisted", "UserStateLoggedIn"];

User.prototype.setState = function(newState){
	if(User.validStates.indexOf(newState) == -1)
		throw "User -> tried to set invalid state: "+newState;
	
	this.state = newState;	
};

User.prototype.isLoggedIn = function(){
	return this.state = "UserStateLoggedIn";	
};

User.prototype.isNew = function(){
	return this.state = "UserStateNew";	
};

User.prototype.getData = function(){
	return { name 			: this.name,
			 password 		: this.password,
			 lastActivity 	: util.actualUnixTime(),
			 state 			: this.state,
			 desktops 		: this.desktops,
			 id				: this.id};	
};

User.prototype.setPassword = function(password){
	this.password = util.encodePassword(password);	
};

User.prototype.checkPassword = function(password){
	return this.password == util.encodePassword(password);	
};


User.prototype.save = function(callback){
	if(this.isNew())
		storage.save(this, callback);
	else
		storage.update(this, callback);
	//TODO set user state
};

User.prototype.remove = function(callback){
	if(!this.isNew())
		storage.remove(this, callback);
};

User.getById = function(id, callback){
	storage.find({id : id}, function(err, users) {
		var user = null;
		if( err || !users){
			log("find(id:"+id+") -> nothing found");
		}
		else{
			log("find(id: "+id+") -> "+users[0]);
			user = new User(users[0]);			
		}
		callback(err, user);
	});
};

User.getByName = function(name, callback){
	storage.find({name : name}, function(err, users) {
		var user = null;
		if( err || !users){
			log("find(id:"+name+") -> nothing found");
		}
		else{
			log("find(id: "+name+") -> "+users[0]);
			user = new User(users[0]);			
		}
		callback(err, user);
	});
};

exports.User = User;