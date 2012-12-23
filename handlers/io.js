var app		 = require("../logic/app").app;

var log = function(msg){
	console.log('handlers.io::'+msg);
};

var IoHandler = {};
IoHandler.recive = function(path, request, response){
	log("recive(path: "+path+")");
	var callback = function(error, fields, files) {
		app.moveFileToDesktop(request.getParam('sessionKey'), files['Filedata'].path, path, function(err, reponseObject) {
			if (err) {
				log(err);
					return response.sendJSONError({error:err});
	  		}
			response.sendJSON(reponseObject);
		});
	};	  
	request.parseFormData(callback, 'binary');
};

IoHandler.remove = function(path, request, response){
	log("remove(path: "+path+")");  
	app.removeFileFromDesktop(request.getParam('sessionKey'), path, function(err, reponseObject){
		if (err) {
			log(err);
			return response.sendJSONError({error:err});
	  	}
		response.sendJSON(reponseObject);
	});
};

IoHandler.send = function(path, request, response){
	log("send(path: "+path+")");
	app.getFileLocation(request.getParam('sessionKey'), path, function(err, file){
		if (err) {
			log(err);
			return response.sendJSONError({error:err});
		}
		response.sendFile(file);
	});
};

IoHandler.mkdir = function(path, request, response){
	log("mkdir(path: "+path+")");
	app.createDirectory(request.getParam('sessionKey'), path, function(err){
		if (err) {
			log(err);
			return response.sendJSONError({error:err});
		}
		
		app.getMetadata(request.getParam('sessionKey'), path, function(err, fileList){
	  		if(err){
	  			log(err);
	  			response.sendJSONError({error:err});
	  		}
	  		else{
	  			log('sending file list: '+JSON.stringify(fileList));
	  			response.sendJSON(fileList);
	  		}
	  	});
	});
};
	  
exports.IoHandler = IoHandler;
