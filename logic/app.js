var config  = require("../config"),
    util	= require("./util"),
    mongo 	= require("mongojs"),
    User 	= require("./user").User,
	Desktop	= require("./desktop").Desktop,
	DbModel = require("../models/db").DbModel,
	IoModel	= require("../models/io").IoModel;

var log = function(msg){
	console.log('logic.app::'+msg);
};

var Application = function(){
    //TODO set timeout for garbage collection, see config
    var activeUsersBySessionKey = { };
    var activeDesktopsBySessionKey = { };
    
//user
    this.authenticateUser = function(name, password, callback){
    	getUserByName(name, function(err, user){
    		if(err) 
    			return callback(err, null);
    		
    		if(!user.checkPassword(password)) 
    			return callback('incorrect password', null);
			
    		if(!activeUsersBySessionKey.hasOwnProperty(user.sessionKey)){
				user.sessionKey = util.uniqueKey(user.id);
				activeUsersBySessionKey[user.sessionKey] = user;
			}
			user.loggedIn = util.actualUnixTime();
			callback(null, user);
    	});
	};
	
	this.logoutUser = function (sessionKey, callback){		
		delete activeUsersBySessionKey[sessionKey];
		delete activeDesktopsBySessionKey[sessionKey];
	};	
	
	var getUserBySessionKey = function(sessionKey){
		if(!activeUsersBySessionKey.hasOwnProperty(sessionKey))
			return false;
		
		return activeUsersBySessionKey[sessionKey];
	};
	
	var getDesktopBySessionKey = function(sessionKey, callback){
		var user = getUserBySessionKey(sessionKey);
		if(!user) 
			return callback('user not authenticated', null);
		
		if(activeDesktopsBySessionKey.hasOwnProperty(user.sessionKey))
			return callback(null, activeDesktopsBySessionKey[user.sessionKey]);
		
		getDesktopByUser(user, function(err, desktop){
			if(err) callback(err, null);
			activeDesktopsBySessionKey[user.sessionKey] = desktop;
			callback(null, desktop);
		});		
	};
	
	this.getMetadata = function(sessionKey, path, callback){
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			desktop.getFiles(path, function (err, files){
				if(err) return callback(err, null);
					
				callback(null, files);
			});
		});
	};

	this.moveFileToDesktop = function(sessionKey, srcPath, targetPath, callback){
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			desktop.storeFile(srcPath, targetPath, callback);
		});
	};
	
	this.getFileLocation = function(sessionKey, path, callback){
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			callback(null, desktop.getFileLocation(path));
		});
	};

	this.removeFileFromDesktop = function(sessionKey, path, callback){
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			desktop.removeFile(path, callback);
		});
	};

	this.createDirectory = function(sessionKey, path, callback){
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			desktop.createDirectory(path, callback);
		});
	};
	
	this.getAccountInfo = function(sessionKey, callback){
		user = getUserBySessionKey(sessionKey);
		
		if(!user) return callback('unauthenticated user', null);
						
		callback(null, {"displayName": user.name, "uid":user._id});
	};

	var db = mongo.connect(config.db.url, config.db.tables);
	var userModel = new DbModel('users', db);
	var desktopModel = new DbModel('desktops', db);
	var ioModel = new IoModel();
	
	var getUserByName = function(name, callback){
		userModel.find({name : name}, function(err, users) {
			if(err) return callback(err, null);
			if(!users || !users.length) return callback('unknown user', null);
			callback(null, new User(users[0], userModel, desktopModel));
		});
	};
	
	var getDesktopByUser = function(user, callback){
		var desktopName = user.name+'@desktop';
		desktopModel.find({name : desktopName}, function(err, desktops) {
			var desktop = null;
			if(err) return callback(err, null);
			if(!desktops)
				desktop = new Desktop({name: name}, desktopModel, ioModel);
			else
				desktop = new Desktop(desktops[0], desktopModel, ioModel);			
			
			desktop.name = desktopName;//workarround for old desktops without name
			callback(null, desktop);
		});			
	};
	
//user admin
	/*createUser: function(data, callback){
		if(!util.isCmd()){
			callback("no permission", null);
			return ;
		}
		var user = new User(data);
		if(typeof data['password'] != undefined)
			user.setPassword(data['password']);
		
		user.save(callback);
	},
	removeUser: function(name, callback){
		if(!util.isCmd()){
			callback("no permission", null);
			return ;
		}
		User.getByName(name, function(err, user){
			if(err){
				callback(err, null);
				return ;
			}
			user.remove(callback);
		});		
	}, 
	garbageCollectUsers : function(callback){
		
	},*/
//desktop	
	
	/*createDesktop: function(sessionKey, data, callback){
		if(typeof this.activeUsersBySessionKey[sessionKey] == 'undefined'){
			callback("unknown session", null);
			return ;
		}
		var desktop = new Desktop(data);
		desktop.save(function(err, desktop){
			DesktopMapper.addUserToDestop(this.activeUsersBySessionKey[sessionKey], desktop, callback);
		});
	},
	removeDesktop: function(user, name, callback){
		if(typeof this.activeUsersBySessionKey[user.sessionKey] == 'undefined'){
			callback("unknown session", null);
			return ;
		}
		Desktop.loadByName(user.name+'@'+name, function(err, desktop){
			if(err){
				callback(err, null);
				return ;
			}
			desktop.remove(callback);
		});
	},
	addUserToDesktop: function(user, desktopName, callback){
		if(typeof this.activeUsersBySessionKey[user.sessionKey] == 'undefined'){
			callback("unknown session", null);
			return ;
		}
		Desktop.loadByName(user.name+'@'+desktopName, function(err, desktop){
			if(err){
				callback(err, null);
				return ;
			}
			DesktopMapper.hasUserAccess(this.activeUsersBySessionKey[user.sessionKey], desktop, function(err, hasAccess){
				if(err || !hasAccess){
					callback(err, null);
					return ;
				}
				DesktopMapper.addUserToDestop(user, desktop, callback);
			});
		});		
	},
	removeUserFromDesktop: function(user, desktopName, callback){
		if(typeof this.activeUsersBySessionKey[user.sessionKey] == 'undefined'){
			callback("unknown session", null);
			return ;
		}
		Desktop.loadByName(user.name+'@'+desktopName, function(err, desktop){
			if(err){
				callback(err, null);
				return ;
			}
			DesktopMapper.hasUserAccess(this.activeUsersBySessionKey[user.sessionKey], desktop, function(err, hasAccess){
				if(err || !hasAccess){
					callback(err, null);
					return ;
				}
				DesktopMapper.removeUserFromDestop(user, desktop, callback);
			});
		});		
	},*/
};

//singleton
exports.app = new Application();
