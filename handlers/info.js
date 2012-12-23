var app		 = require("../logic/app").app;

var log = function(msg){
	console.log('handlers.info::'+msg);
};

var InfoHandler = {};
InfoHandler.getMetadata = function(path, request, response) {
	log("getMetadata(path: "+path+")");

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
};

InfoHandler.getChanged = function(path, request, response) {
	log("getChanged(path: "+path+")");
	//TODO
};

exports.InfoHandler = InfoHandler;