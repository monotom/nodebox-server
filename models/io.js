var fs		= require("fs"),
	util 	= require('util');

var log = function(msg){
	console.log('models.io::'+msg);
};

var IoModel = function(){
	var self = this;
	this.getInfo = function(path, callback){
		log('look up for files in path: '+path);
		if(!fs.existsSync(path)) return callback('path doesnt exist', null);
		
		var result = {file: path,
					  stats:fs.statSync(path), 
					  childs:[]};
		
		if(!result.stats.isDirectory())
			return callback(null, result);
		
		fs.readdir(path, function(err, list) {
			if (err) return callback(err, null);
			var pending = list.length;
			if (!pending) return callback(null, result);
			list.forEach(function(fileName) {
				file = path + fileName;
				fs.stat(file, function(err, stat) {
					if(!err)
						result.childs.push({file:file, stats:stat, childs:[]});
					
					if (!--pending) callback(null, result);
				});
			});
		});
	};
	
	this.moveFile = function(srcPath, targetPath, callback){
		var is = fs.createReadStream(srcPath);
		var os = fs.createWriteStream(targetPath);
		is.once('open', function(fd){
			util.pump(is, os, function() {
			    fs.unlinkSync(srcPath);
			    callback();
			});
		}); 
	};
	
	this.renameFile = function(srcPath, targetPath, callback){
		if(callback)
			return fs.rename(srcPath, targetPath, callback);
		else
			return fs.renameSync(srcPath, targetPath);
	};
	
	this.removeFile = function(path, callback){
		if(callback)
			return fs.unlink(path, callback);
		else
			return fs.unlinkSync(path);
	};
	
	this.createDirectory = function(path, callback, mode, position){
		var osSep = process.platform === 'win32' ? '\\' : '/';
		var parts = require('path').normalize(path).split(osSep);
	
	    mode = mode || process.umask();
	    position = position || 0;
	  
	    if (position >= parts.length) {
	      return callback();
	    }
	  
	    var directory = parts.slice(0, position + 1).join(osSep) || osSep;
	    fs.stat(directory, function(err) {    
	    	if (err === null) {
	    		self.createDirectory(path, callback, mode, position + 1);
	    	} else {
	    		fs.mkdir(directory, mode, function (err) {
	    			if (err && err.code != 'EEXIST') {
	    				return callback(err);
	    			} else {
	    				self.createDirectory(path, callback, mode, position + 1);
	    			}
	    		});
	    	}
	    });	    
	};
};

exports.IoModel = IoModel;