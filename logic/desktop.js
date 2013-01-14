var config   = require('../config'),
    util	 = require('./util'),
    log		= util.getLogger('logic.desktop::'),
    File 	 = require('./file').File;

/**
* @author Tom Hanoldt
* @class The logical desktop object corresponding to a user object.
* 
* @param data An object containig the data from the concrete user.
* @param model The model used to store the users data.
*/
var Desktop = function(data, model, io){
	var self = this;
	for(var key in data){ 
		this[key] = data[key];
	}
	
	/**
	* Save the desktop object.
	*                  
	* @param callback The callback method called when the operation finished. Parameter passed to the callback method is error if there is one.
	*
	* @return void
	*/
	this.save = function(callback){
		model.update(this._id, { name 			: this.name || 'DefaultName',
			 					 lastActivity 	: util.actualUnixTime()}, callback);
	};
	
	/**
	* Delete the desktop object.
	*                  
	* @param callback The callback method called when the operation finished. Parameter passed to the callback method is error if there is one.
	*
	* @return void
	*/
	this.remove = function(callback){
		model.remove(this._id, function(err){
			if(err)return callback(err);
			
			io.removeFile(self.getStorageBasePath(), callback);
		});
	};
	
	/**
	* Get the local storage base path for this desktop object.
	*                  
	* @return String the local storage base path for this desktop object.
	*/
	this.getStorageBasePath = function(){
		return config.io.basePath + this.name;
	};
	
	/**
	* Get the location of a file within this desktop.
	*                  
	* @param path The relative path of the file or folder.
	*
	* @return String the local storage path for requested file.
	*/
	this.getFileLocation = function(path){
		return this.getStorageBasePath()+path;
	};
	
	/**
	* Create the local storage base path for this desktop if not exists.
	*             
	* æparam callback The callback method is called when the operation is finished. Parameter passed is error if ther was one.            
	*                  
	* @return void
	*/
	this.makeSureBasePathExists = function(callback){
		io.createDirectory(self.getStorageBasePath(), callback);
	};
	
	this.getFiles = function(path, callback){
		return io.getInfo(self.getFileLocation(path), function(err, item){
			if(err) return callback(err, null);
			
			callback(null, ioFileInfoToResponseFile(item, path, self.getStorageBasePath()));
		});
	};
	
	/**
	* Move a file to the desktop storage directory
	*                  
	* @param srcPath Source path of the file or folder.             
    * @param targetPath The target path of the file or folder.
    * @param callback The callback method called when the operation finished. 
    * Parameters passed to the callback method are error and File @see File.
	*
	* @return void
	*/
	this.storeFile = function(srcPath, targetPath, callback){
		log('storing file to '+self.getFileLocation(targetPath));
		io.moveFile(srcPath, self.getFileLocation(targetPath), function(){
			self.getFiles(targetPath.replace(self.getStorageBasePath(), ''), callback);
		});
	};

	/**
	* Delete a file from the desktop.
	*                  
	* @param path The relative path of the file or folder.
	* @param callback The callback method called when the operation finished. Parameters passed to the callback method are error and Object {success: true}.
	*
	* @return void
	*/
	this.removeFile = function(path, callback){
		log('storing file to '+path);
		io.removeFile(self.getFileLocation(path), function(){
			callback(null, {success:true});//TODO check client
		});
	};
	
	/**
	* Create a directory recursive within the desktop
	*                  
	* @param path The relative path of the file or folder.
	* @param callback The callback method called when the operation finished. Parameters passed to the callback method are error and Object {success: true}.
	*
	* @return void
	*/
	this.createDirectory = function(path, callback){
		log('creating directory '+path);
		io.createDirectory(self.getFileLocation(path), function(){
			callback(null, {success:true});//TODO check client
		});
	};
	
	/**
	* Convert the reulst of a fstat to a File object. @see File
	*                  
	* @param item An object containig the fstat informations.
	* @param root The relative path within the desktop.
	* @param localPath The local desktop base path.
	*
	* @return File The File object containig the informations about local file.
	*/
	var ioFileInfoToResponseFile = function(item, root, localPath){
		var lastChangeDate = item.stats.hasOwnProperty('mtime') ? item.stats['mtime'] : item.stats['ctime'];
		var file = new File({
			bytes:		item.stats['size'],
			modified:	lastChangeDate,
			is_dir: 	item.stats.isDirectory(),
			root:		root,
			size: 		util.bytesToHumanReadable(item.stats['size']),
			path: 		item.file.replace(localPath, ''),
			revision: 	util.md5(lastChangeDate+item.stats['size']),
			isDeleted: 	false,
			hash: 		util.md5(lastChangeDate+item.stats['size']),
			childs: 	[]
		});
		
		if(item.childs)
			for(var i = 0; i < item.childs.length; i++)
				file.childs.push(ioFileInfoToResponseFile(item.childs[i], root, localPath));
		
		return file;
	};
};

exports.Desktop = Desktop;