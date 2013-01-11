var app		= require("../logic/app").app,
	log		= require('../logic/util').getLogger('handlers.info::');

/**
* @author Tom Hanoldt
* @class Handles incomming information requests about files on a desktop. 
*/
var InfoHandler = function(){
	/**
	 * Sends information about an user account identified by a session key back to the client.
	 * The request must contain a parameter sessionKey containing a valid session key of a authenticated user.
	 * On Success a json encoded object containing files is sent back to the client. @see File
	 * If there was a problem collectiong the information an json encoded object is sent back to the client {error:'reaon'}.
	 * 
	 * @param path The matched path processed by the router. @see Router
	 * @param request The request object send from the client. @see RequestMixIn 
	 * @param response The response object used to send an answer back to the requesting client. @see ResponseMixIn 
	 * 
	 * @return void
	 */
	this.getMetadata = function(path, request, response) {
		log("getMetadata(path: "+path+")");
	
	  	app.getMetadata(request.getParam('sessionKey'), path, function(err, fileList){
	  		if(err){
	  			log(err);
	  			response.sendJSONError({error:err});
	  		}
	  		else{
	  			log('sending file list' );
	  			response.sendJSON(fileList);
	  		}
	  	});
	};
};

exports.InfoHandler = new InfoHandler();