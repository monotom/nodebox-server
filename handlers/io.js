var app		= require("../logic/app").app,
	log		= require('../logic/util').getLogger('handlers.io::');

/**
* @author Tom Hanoldt
* @class Handles incomming file operation requests on desktop files. 
*/
var IoHandler = function(){
	/**
	 * Recives a file sent from client and loads it up to the desktop of the user.
	 * The request must contain a parameter sessionKey containing a valid session key of a authenticated user.
	 * On success informations about the folder are sent back in an json encoded object from type File. @see File 
	 * If there was a problem processing the request an json encoded object is sent back to the client {error:'reaon'}.
	 * 
	 * @param path The matched path processed by the router. @see Router
	 * @param request The request object send from the client. @see RequestMixIn 
	 * @param response The response object used to send an answer back to the requesting client. @see ResponseMixIn 
	 * 
	 * @return void
	 */
	this.recive = function(path, request, response){
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
	
	/**
	 * Removes a file from the users desktop.
	 * The request must contain a parameter sessionKey containing a valid session key of a authenticated user.
	 * On success an json encoded object is sent back to the client. {success: true}
	 * If there was a problem processing the request an json encoded object is sent back to the client {error:'reaon'}.
	 *
	 * @param path The matched path processed by the router. @see Router
	 * @param request The request object send from the client. @see RequestMixIn 
	 * @param response The response object used to send an answer back to the requesting client. @see ResponseMixIn 
	 * 
	 * @return void
	 */
	this.remove = function(path, request, response){
		log("remove(path: "+path+")");  
		app.removeFileFromDesktop(request.getParam('sessionKey'), path, function(err, reponseObject){
			if (err) {
				log(err);
				return response.sendJSONError({error:err});
		  	}
			response.sendJSON(reponseObject);
		});
	};
	
	/**
	 * Sends the content of a file from the users desktop back to the client encoded as binary.
	 * The request must contain a parameter sessionKey containing a valid session key of a authenticated user.
	 * On success the content of the file is sent back to the user encoded as bnary. 
	 * If there was a problem processing the request an json encoded object is sent back to the client {error:'reaon'}.
	 *
	 * @param path The matched path processed by the router. @see Router
	 * @param request The request object send from the client. @see RequestMixIn 
	 * @param response The response object used to send an answer back to the requesting client. @see ResponseMixIn 
	 * 
	 * @return void
	 */
	this.send = function(path, request, response){
		log("send(path: "+path+")");
		app.getFileLocation(request.getParam('sessionKey'), path, function(err, file){
			if (err) {
				log(err);
				return response.sendJSONError({error:err});
			}
			response.sendFile(file);
		});
	};
	
	/**
	 * Creates a directory recursive in side the users desktop
	 * The request must contain a parameter sessionKey containing a valid session key of a authenticated user.
	 * On success informations about the folder are sent back in an json encoded object from type File. @see File 
	 * If there was a problem processing the request an json encoded object is sent back to the client {error:'reaon'}.
	 * 
	 * @param path The matched path processed by the router. @see Router
	 * @param request The request object send from the client. @see RequestMixIn 
	 * @param response The response object used to send an answer back to the requesting client. @see ResponseMixIn 
	 * 
	 * @return void
	 */
	this.mkdir = function(path, request, response){
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
};

exports.IoHandler = new IoHandler();