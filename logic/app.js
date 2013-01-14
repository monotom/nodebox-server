var config  = require("../config"),
    util	= require("./util"),
    log		= util.getLogger('logic.app::'),
    mongo 	= require("mongojs"),
    User 	= require("./user").User,
	Desktop	= require("./desktop").Desktop,
	DbModel = require("../models/db").DbModel,
	IoModel	= require("../models/io").IoModel;

/**
* @author Tom Hanoldt
* @class The Application class handles the main operations for retriving and accessing User and Desktop objects and controlls security issues.
*/
var Application = function(){
	var self = this;
    var activeUsersBySessionKey = { };
    var activeDesktopsBySessionKey = { };
    
    /**
    * Authenticate a user.
    *                  
    * @param name The name of the user.
    * @param password The password of the user.
    * @param callback this method is called when the operation finished. Parameters passed to the method are error or a User object @see User. 
    *
    * @return void
    */
    this.authenticateUser = function(name, password, callback){
    	if(!name || !password)
    		return callback('missing parameter');
    	
    	getUserByName(name, function(err, user){
    		if(err == 'unknown user' 
    		&& !config.app.createUserIfNotExists)
    			return callback(err, null);
    		    		
    		if(err == 'unknown user'){
				user = new User({'name':name}, userModel);
				user.setPassword(password);
				user.save(function(err){
					if(err) return callback(err);
					self.authenticateUser(name, password, callback);
				});
    		}
    		else{
    			if(!user.checkPassword(password)) 
        			return callback('incorrect password', null);
    			
        		if(!activeUsersBySessionKey.hasOwnProperty(user.sessionKey)){
    				user.sessionKey = util.uniqueKey(user.id);
    				activeUsersBySessionKey[user.sessionKey] = user;
    			}
    			user.loggedIn = util.actualUnixTime();
    			callback(null, user);
    		}   		
    	});
	};
	
    /**
    * Create a new user.
    *                  
    * @param name The name of the user.
    * @param password The password of the user.
    * @param data additional user data in object form.
    * @param callback this method is called when the operation finished. Parameters passed to the method are error or a User object @see User. 
    *
    * @return void
    */
    this.createUser = function(name, password, data, callback){
    	if(!name || !password)
    		return callback('missing parameter');
    	
    	getUserByName(name, function(err, user){
    		if(err && err != 'unknown user')
    			return callback(err);
    		
    		if(err && err == 'unknown user')
    			return callback('user exists');
    		
	    	var user = new User(data, userModel);
	    	user.name = name;
			user.setPassword(password);
			user.save(function(err){
				if(err) return callback(err);
				callback(null, user);
			});
    	});
	};
	
	/**
	* Logs a user out.
	*                  
	* @param sessionKey The sessionKey of the active user
	* @param callback this method is called when the operation finished.
	* 
	* @return void
	*/
	this.logoutUser = function (sessionKey, callback){		
		delete activeUsersBySessionKey[sessionKey];
		delete activeDesktopsBySessionKey[sessionKey];
		callback();
	};	
	
	/**
	* Get a user object by session key.
	*                  
	* @param sessionKey The sessionKey of the active user.
	*
	* @return False or a user object. @see User
	*/
	var getUserBySessionKey = function(sessionKey){
		if(!activeUsersBySessionKey.hasOwnProperty(sessionKey))
			return false;
		
		return activeUsersBySessionKey[sessionKey];
	};
	
	/**
	* Delete a user object and associated data by session key.
	*                  
	* @param sessionKey The sessionKey of the active user.
	* @param callback This method is called when the operation finished. parameter passed to callback error. 
	*
	* @return void
	*/
	this.removeUserBySessionKey = function(sessionKey, callback){
		var user = getUserBySessionKey(sessionKey);
		if(!user) 
			return callback('user not authenticated', null);
		
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			desktop.remove(function(err){
				if(err) return callback(null);
				
				user.remove(callback);
			});
		});
	};
	
	/**
	* Get a desktop objekt by session key.
	*                  
	* @param sessionKey sessionKey The sessionKey of the active user.
	* @param callback This method is called, when the operation is finished. Parameters passed to the method are error, a Desktop object. @see Desktop 
	* 
	* @return void
	*/
	var getDesktopBySessionKey = function(sessionKey, callback){
		var user = getUserBySessionKey(sessionKey);
		if(!user) 
			return callback('user not authenticated', null);
		
		if(activeDesktopsBySessionKey.hasOwnProperty(user.sessionKey))
			return callback(null, activeDesktopsBySessionKey[user.sessionKey]);
		
		getDesktopByUser(user, function(err, desktop){
			if(err) callback(err, null);
			activeDesktopsBySessionKey[user.sessionKey] = desktop;
			desktop.makeSureBasePathExists(function(err){
				if(err) return callback(err);
				callback(null, desktop);
			});
			
		});		
	};
	
	/**
	* Get information about a file or a folder within a desktop
	*                  
	* @param sessionKey sessionKey The sessionKey of the active user.
	* @param path The path to get informations for.
	* @param callback This method is called, when the operation is finished. Parameters passed to the method are error, a File object. @see File 
	*
	* @return void
	*/
	this.getMetadata = function(sessionKey, path, callback){
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			desktop.getFiles(path, function (err, files){
				if(err) return callback(err, null);
					
				callback(null, files);
			});
		});
	};

	/**
	* Moves a file to a desktop
	*                  
	* @param sessionKey sessionKey The sessionKey of the active user.
	* @param srcPath Source path of the file or folder.             
    * @param targetPath The target path within the desktop of the file or folder.
    * @param callback This method is called, when the operation is finished. Parameters passed to the method are error, a File object. @see File 
	* 
	* @return void
	*/
	this.moveFileToDesktop = function(sessionKey, srcPath, targetPath, callback){
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			desktop.storeFile(srcPath, targetPath, callback);
		});
	};
	
	/**
	* Get the local location of a file within a desktop.
	*                  
	* @param sessionKey sessionKey The sessionKey of the active user.
	* @param path The relative path on the desktop.
	* @param callback The callback method called when the operation is finished. Parameters passed to the method are error, the local path of the file.
	*
	* @return void
	*/
	this.getFileLocation = function(sessionKey, path, callback){
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			callback(null, desktop.getFileLocation(path));
		});
	};

	/**
	* Deletes a file from the desktop.
	*                  
	* @param sessionKey sessionKey The sessionKey of the active user.
	* @param path Path to the file or folder.
	* @param callback A method called when the operation has finished. Parameters passed to the method are error(String). 
	* 
	* @return void
	*/
	this.removeFileFromDesktop = function(sessionKey, path, callback){
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			desktop.removeFile(path, callback);
		});
	};

	/**
	* Creates a directory recursive on the users desktop.
	*                  
	* @param sessionKey sessionKey The sessionKey of the active user.
	* @param path Path to the file or folder
	* @param callback The callback method called when the operation finished. Parameters passed to the callback method are error and Object {success: true}.
	*
	* @return void
	*/
	this.createDirectory = function(sessionKey, path, callback){
		getDesktopBySessionKey(sessionKey, function(err, desktop){
			if(err) return callback(err, null);
			
			desktop.createDirectory(path, callback);
		});
	};
	
	/**
	* Get information about an active user.
	*                  
	* @param sessionKey sessionKey The sessionKey of the active user.
	* @param callback The callback method called when the operation finished. Parameters passed to the callback method are error and an Object containig the user informations.
	*
	* @return void
	*/
	this.getAccountInfo = function(sessionKey, callback){
		user = getUserBySessionKey(sessionKey);
		
		if(!user) return callback('unauthenticated user', null);
						
		callback(null, {"displayName": user.name, "uid":user._id});
	};

	var db = mongo.connect(config.db.url, config.db.tables);
	var userModel = new DbModel('users', db);
	var desktopModel = new DbModel('desktops', db);
	var ioModel = new IoModel();
	
	this.getUserModel = function(){
		return userModel;
	};
	
	/**
	* Get a user object by its name.
	*                  
	* @param name The name of the user.
	* @param callback The callback method called when the operation finished. Parameters passed to the callback method are error and an User object. @see User
	*
	* @return void
	*/
	var getUserByName = function(name, callback){
		userModel.find({name : name}, function(err, users) {
			if(err) return callback(err, null);
			if(!users || !users.length) return callback('unknown user', null);
			callback(null, new User(users[0], userModel));
		});
	};
	
	/**
	* Get the Desktop object by a User object.
	*                  
	* @param user The User object to get the correlating Desktop object for.
	* @param callback The callback method called when the operation finished. Parameters passed to the callback method are error and an Desktop object. @see Desktop
	*
	* @return void
	*/
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
};

//singleton
exports.app = new Application();