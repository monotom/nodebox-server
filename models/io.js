var fs		= require("fs"),
	util 	= require('util'),
    log		= require('../logic/util').getLogger('models.io::');

/**
* @author Tom Hanoldt
* @class Handles the local file access.
*/
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
				var filePath = (path + '/' + fileName).replace('//','/');
				fs.stat(filePath, function(err, stat) {
					if(!err)
						result.childs.push({file:filePath, stats:stat, childs:[]});
					else
						log('err: '+err);

					if (!--pending) callback(null, result);
				});
			});
		});
	};
	
	/**
	* Move a file or folder accross partitions.
    *                  
    * @param srcPath Source path of the file or folder.             
    * @param targetPath The target path of the file or folder.
    * @param callback A method called when the operation is finished. Parameters passed to the method are error(String)
    *
    * @return void
	*/
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
	
	/**
	* Rename or move a file or folder on the same partition.
    *                  
    * @param srcPath Source path of the file or folder.             
    * @param targetPath The target path of the file or folder on the same partition.
    * @param callback A method called when the operation is finished. Parameters passed to the method are error(String)
    *
    * @return void
	*/
	this.renameFile = function(srcPath, targetPath, callback){
		if(callback)
			return fs.rename(srcPath, targetPath, callback);
		else
			return fs.renameSync(srcPath, targetPath);
	};
	
	/**
	* Delete a file or folder.
    *                  
    * @param path The path of the file or folder.
    * @param callback A method called when the operation has finished. Parameters passed to the method are error(String).
    *
    * @return void
	*/
	this.removeFile = function(path, cb){
		fs.stat(path, function(err, stats) {
	      if(err) return cb(err,stats);
	      
	      if(stats.isFile()){
	        fs.unlink(path, function(err) {
	          if(err) {
	            cb(err,null);
	          }else{
	            cb(null,true);
	          }
	          return;
	        });
	      }else if(stats.isDirectory()){
	        // A folder may contain files
	        // We need to delete the files first
	        // When all are deleted we could delete the 
	        // dir itself
	        fs.readdir(path, function(err, files) {
	          if(err){
	            cb(err,null);
	            return;
	          }
	          var f_length = files.length;
	          var f_delete_index = 0;
	 
	          // Check and keep track of deleted files
	          // Delete the folder itself when the files are deleted
	 
	          var checkStatus = function(){
	            // We check the status
	            // and count till we r done
	            if(f_length===f_delete_index){
	              fs.rmdir(path, function(err) {
	                if(err){
	                  cb(err,null);
	                }else{ 
	                  cb(null,true);
	                }
	              });
	              return true;
	            }
	            return false;
	          };
	          if(!checkStatus()){
	            for(var i=0;i<f_length;i++){
	              // Create a local scope for filePath
	              // Not really needed, but just good practice
	              // (as strings arn't passed by reference)
	              (function(){
	                var filePath = path + '/' + files[i];
	                // Add a named function as callback
	                // just to enlighten debugging
	                self.removeFile(filePath,function removeRecursiveCB(err,status){
	                  if(!err){
	                    f_delete_index ++;
	                    checkStatus();
	                  }else{
	                    cb(err,null);
	                    return;
	                  }
	                });
	              })();
	            }
	          }
	        });
	      }
	    });
	};
	
	/**
	* Creates a folder recursive.
    *                  
    * @param path The path of the file or folder.
    * @param callback A method called when the informations are collected. Parameters passed to the method are error(String),
    * @param mode The permissions mode the folders are created
    * @param position Used intern for recursive calls.
    *
    * @return void
	*/
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