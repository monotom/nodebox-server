/**
* @author Tom Hanoldt
* @class Represents a local file. Used to transfere file information accross a network.
* @param data A object containig information about the file.
*/
var File = function(data){
	this.bytes 		= 	0;
	this.modified 	=	null;
	this.is_dir 	= 	false;
	this.root 		=   '';
	this.size 		= 	'0 bytes';
	this.path 		= 	'';
	this.revision 	= 	'';
	this.isDeleted 	= 	false;
	this.has 		= 	'';
	this.childs 	= 	[];

	for(var key in data){ 
		this[key] = data[key];
	}
};

exports.File = File;