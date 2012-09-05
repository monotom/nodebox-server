var mongo  = require("mongojs"),
    config = require("../config"),
    logger = require("../server/log").log;

var log = function(msg){
	logger("storage."+msg);
};

var db = mongo.connect(config["db"]["url"], config["db"]["tables"]);

exports.user = {
	find : function(criteria, callback){
		find('users', criteria, callback);
	},	
	save : function(user, callback){
		if(typeof user.id == "undefined")
			user.id = db.bson.ObjectID.createPk();
	
		save('users', user.getData(), callback);
	},
	update : function(user, callback){
		update('users', user.id, user.getData(), callback);
	},
	remove : function(user, callback){
		remove('users', user.id, callback);
	},
};


exports.desktop = {
	find : function(criteria, callback){
		find('desktops', criteria, callback);
	},
	save : function(desktop, callback){
		if(typeof desktop.id == "undefined")
			desktop.id = db.bson.ObjectID.createPk();
	
		save('desktops', desktop.getData(), callback);
	},
	update : function(desktop, callback){
		update('desktops', desktop.id, desktop.getData(), callback);
	},
	remove : function(desktop, callback){
		remove('desktops', desktop.id, callback);
	}
};

var find = function(collection, criteria, callback){
	log(collection+".find("+criteria+")");
	var internCallback = function(err, users) {
		if( err || !users) log(collection+".find("+criteria+") -> nothing found");
		else users.forEach( function(resultRow) {
		    log(collection+".find("+criteria+") -> "+resultRow);
		});
		callback(err, users);
	};
	
	db[collection].find(criteria, internCallback);
};

var save = function(collection, data, callback){
	log(collection+".save("+data+")");
	var internCallback = function(err, saved) {
		  if( err || !saved ) log(collection+".save("+data+") -> not saved");
		  else log(collection+".save("+data+") -> saved");
		  callback(err, saved);
	};
	
	db[collection].save(data, internCallback);
};

var update = function(collection, key, data, callback){
	log(collection+".update("+key+", "+data+")");
	var internCallback = function(err, updated) {
		  if( err || !updated ) log(collection+".update("+key+") -> not updated");
		  else log(collection+".update("+key+") -> updated");
		  callback(err, updated);
	};
		
	db[collection].update(key,  {$set: data, } , internCallback);
};
//db.users.update({email: "srirangan@gmail.com"}, {$set: {password: "iReallyLoveMongo"}}, );

var remove = function(collection, key, callback){
	log(collection+".delete("+key+")");
	var internCallback = function(err, deleted) {
		  if( err || !deleted ) log(collection+".delete("+key+") -> could not delete");
		  else log(collection+".delete("+key+") -> deleted");
		  callback(err, deleted);
	};
		
	db[collection].remove(key,  internCallback);
};
