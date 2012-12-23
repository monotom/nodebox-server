var app		 = require("../logic/app").app;

var log = function(msg){
	console.log('handlers.account::'+msg);
};

var AccountHandler = {};
AccountHandler.info = function(path, request, response){
	log("info()");
  	app.getAccountInfo(request.getParam('sessionKey'), function(err, responseObject){
  		if(err){
  			log(err);
  			response.sendJSONError({error:err});
  		}
  		else{
  			log('sending response: '+responseObject);
  			response.sendJSON(responseObject);
  		}
  	});
};

exports.AccountHandler = AccountHandler;