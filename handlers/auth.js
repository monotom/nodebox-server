var app		 = require("../logic/app").app,
	queryString = require("querystring"),
	log		 = require('../logic/util').getLogger('handlers.auth::');

/**
* @author Tom Hanoldt
* @class Handles incomming authentication requests.
*/
var AuthHandler = function(){
	/**
	 * Sends Handles the login of a user. The request must contain a parameter user with the user name and a parameter pass with the users password.
	 * If authentication was successfull the the session key is sent back to the user as an json encoded object {sessionKey:user.sessionKey}.
	 * If there was a problem authenticating the user an json encoded object is sent back to the client {error:'reaon'}.
	 * 
	 * @param path The matched path processed by the router. @see Router
	 * @param request The request object send from the client. @see RequestMixIn 
	 * @param response The response object used to send an answer back to the requesting client. @see ResponseMixIn 
	 * 
	 * @return void
	 */
	this.login = function(path, request, response) {
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
};

exports.AuthHandler = new AuthHandler();