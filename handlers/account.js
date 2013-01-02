var app		= require("../logic/app").app,
	log		= require('../logic/util').getLogger('handlers.account::');

/**
* @author Tom Hanoldt
* @class Handles incomming information requests about users.
*/
var AccountHandler = function(){
	/**
	 * Sends information about an user account identified by a session key back to the client.
	 * The request must contain a parameter sessionKey containing a valid session key of a authenticated user.
	 * On success an json encoded object is send back to the client containing the informations about the user. {"displayName": user.name, "uid":user._id}
	 * If there was a problem collection the information an json encoded object is sent back to the client {error:'reaon'}.
	 *
	 * @param path The matched path processed by the router. @see Router
	 * @param request The request object send from the client. @see RequestMixIn 
	 * @param response The response object used to send an answer back to the requesting client. @see ResponseMixIn 
	 * 
	 * @return void
	 */
	this.info = function(path, request, response){
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
};

exports.AccountHandler = new AccountHandler();