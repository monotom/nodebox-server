var config   = require('../config'),
    util	 = require('./util'),
    File 	 = require('./file').File;

var log = function(msg){
	console.log('logic.desktop::'+msg);
};

Desktop = function(data, model, io){
	var self = this;
	for(var key in data){ 
		this[key] = data[key];
	}
	
	this.getData = function(){
		return { name 			: this.name || 'DefaultName',
				 lastActivity 	: util.actualUnixTime()};	
	};
	
	this.save = function(callback){
		model.update(this._id, this.getData(), callback);
	};
	
	this.remove = function(callback){
		model.remove(this._id, callback);
	};
	
	this.getStorageBasePath = function(){
		return config.io.basePath + this.name;
	};
	
	this.getFileLocation = function(path){
		return this.getStorageBasePath()+path;
	};
	
	this.getFiles = function(path, callback){
		return io.getInfo(self.getFileLocation(path), function(err, item){
			if(err) return callback(err, null);
			
			callback(null, ioFileInfoToResponseFile(item, path, self.getStorageBasePath()));
		});
	};
	
	this.storeFile = function(srcPath, targetPath, callback){
		log('storing file to '+file);
		io.moveFile(srcPath, self.getFileLocation(targetPath), function(){
			self.getFiles(file.replace(self.getStorageBasePath(), ''), callback);
		});
	};

	this.removeFile = function(path, callback){
		log('storing file to '+file);
		io.removeFile(self.getFileLocation(path), function(){
			callback(null, {success:true});//TODO check client
		});
	};
	
	this.createDirectory = function(path, callback){
		log('creating directory '+path);
		io.createDirectory(self.getFileLocation(path), function(){
			callback(null, {success:true});//TODO check client
		});
	};
	
	var ioFileInfoToResponseFile = function(item, root, localPath){
		var lastChangeDate = item.stats.hasOwnProperty('mtime') ? item.stats['mtime'] : item.stats['ctime'];
		var file = new File({
			bytes:		item.stats['size'],
			modified:	lastChangeDate,
			is_dir: 	item.stats.isDirectory(),
			root:		root,
			size: 		util.bytesToHumanReadable(item.stats['size']),
			path: 		item.file.replace(localPath, ''),
			revision: 	util.md5(lastChangeDate),
			isDeleted: 	false,
			hash: 		util.md5(lastChangeDate),
			childs: 	[]
		});
		
		if(item.childs){
			for(var i = 0; i < item.childs.length; i++){
				file.childs.push(ioFileInfoToResponseFile(item.childs[i], root, localPath));
			}
		}
		return file;
	};
};

exports.Desktop = Desktop;