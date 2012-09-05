var moo      = require('mootools'),
    log      = require("../server/log").log,
    protocol = require("../server/protocol"),
    config   = require("../config"),
    util	 = require("../logic/util");

var app = new Class({
    Implements: Events,
    initialize: function(){
    	//TODO set timeout for garbage collection, see config
    },
//user
    activeUsersBySessionKey : { },
    activeDesktopsBySessionKey : { },
    authenticateUser: function(name, password, callback){
    	this.getUserbyName(name, function(err, user){
    		if(err 
    		|| !user.checkPassword(password))
    			callback(err, null);
    		else{
    			user.loggedIn = util.actualUnixTime();
    			user.sessionKey = util.uniqueKey(user.id);
    			if(typeof this.activeUsersBySessionKey == 'undefined')
    				this.activeUsersBySessionKey = {};//TODO check an remove with class
    			
    			this.activeUsersBySessionKey[user.sessionKey] = user;
    			callback(null, user);
    		}
    	});
	},
	logoutUser: function (sessionKey, callback){		
		delete this.activeUsersBySessionKey[sessionKey];
		delete this.activeDesktopsBySessionKey[sessionKey];
	},
//user admin
	createUser: function(data, callback){
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
		
	},
//desktop	
	loadDesktop : function(sessionKey, desktopName, callback){
		if(typeof this.activeDesktopsBySessionKey[sessionKey] != 'undefined'){
			callback(null, this.activeDesktopsBySessionKey[sessionKey]);
			return ;
		}
		Desktop.loadByName(destopName, function(err, destop){
			if(err){
				callback(err, null);
				return ;
			}			
			DesktopMapper.hasUserAccess(this.activeUsersBySessionKey[sessionKey], desktop, function(err, hasAccess){
				if(err || !hasAccess){
					callback(err, null);
					return ;
				}				
				this.activeDesktopsBySessionKey[sessionKey] = desktop;
				callback(null, desktop);
			});
		});
			
	},
	createDesktop: function(sessionKey, data, callback){
		if(typeof this.activeUsersBySessionKey[sessionKey] == 'undefined'){
			callback("unknown session", null);
			return ;
		}
		var desktop = new Desktop(data);
		desktop.save(function(err, desktop){
			DesktopMapper.addUserToDestop(this.activeUsersBySessionKey[sessionKey], desktop, callback);
		});
	},
	removeDesktop: function(sessionKey, name, callback){
		if(typeof this.activeUsersBySessionKey[sessionKey] == 'undefined'){
			callback("unknown session", null);
			return ;
		}
		Desktop.loadByName(name, function(err, desktop){
			if(err){
				callback(err, null);
				return ;
			}
			desktop.remove(callback);
		});
	},
	addUserToDesktop: function(sessionKey, userName, desktopName, callback){
		if(typeof this.activeUsersBySessionKey[sessionKey] == 'undefined'){
			callback("unknown session", null);
			return ;
		}
		Desktop.loadByName(desktopName, function(err, desktop){
			if(err){
				callback(err, null);
				return ;
			}
			DesktopMapper.hasUserAccess(this.activeUsersBySessionKey[sessionKey], desktop, function(err, hasAccess){
				if(err || !hasAccess){
					callback(err, null);
					return ;
				}
				User.loadByName(userName, function(err, user){
					if(err){
						callback(err, null);
						return ;
					}
					DesktopMapper.addUserToDestop(user, desktop, callback);
				});
			});
		});		
	},
	removeUserFromDesktop: function(sessionKey, userName, desktopName, callback){
		if(typeof this.activeUsersBySessionKey[sessionKey] == 'undefined'){
			callback("unknown session", null);
			return ;
		}
		Desktop.loadByName(desktopName, function(err, desktop){
			if(err){
				callback(err, null);
				return ;
			}
			DesktopMapper.hasUserAccess(this.activeUsersBySessionKey[sessionKey], desktop, function(err, hasAccess){
				if(err || !hasAccess){
					callback(err, null);
					return ;
				}
				User.loadByName(userName, function(err, user){
					if(err){
						callback(err, null);
						return ;
					}
					DesktopMapper.removeUserFromDestop(user, desktop, callback);
				});
			});
		});		
	},
});

exports.app = new app();