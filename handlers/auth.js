var app		 = require("../logic/app").app,
	queryString = require("querystring");

var log = function(msg){
	console.log('handlers.auth::'+msg);
};

var AuthHandler = {};
AuthHandler.login = function(path, request, response) {
	log("login()");
	
	var fullBody = '';
	request.on('data', function(chunk) {
      // append the current chunk of data to the fullBody variable
      fullBody += chunk.toString();
    });
    
	request.on('end', function() {
		// parse the received body data
		var decodedBody = queryString.parse(fullBody);
		if(!decodedBody.hasOwnProperty('user')
		|| !decodedBody.hasOwnProperty('pass'))
			return response.sendJSONError({error:'missing parameter'});
		
	  	app.authenticateUser(decodedBody.user, decodedBody.pass, function(err, user){
	  		if(err){
	  			log(err);
	  			return response.sendJSONError({error:err});
	  		}
	  		
	  		response.sendJSON({sessionKey:user.sessionKey});
	  	});
    });
};

exports.AuthHandler = AuthHandler;