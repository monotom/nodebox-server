var http     = require("http"),
	protocol = require("./protocol"),
	util	 = require("../logic/util"),
	log		 = util.getLogger('server.server::');

/**
 * @author Tom Hanoldt
 * @class This class wraps the server logic and controls the client request dispatching.
 * @param dispatcher The dispatcher maps the request to a handler. @see Dispatcher 
 */
var Server = function(dispatcher){
     /**
	  * Called whenever a client makes a requests to the port the server runs on.
      * This method also mixes the request/response extension into request and response. 
      * @see RequestMixIn 
      * @see ResponseMixIn
      *                  
      * @param request The request object, the client sends is from type IncommingMessage. 
      * @param response The response object, send to the client is from type OutgoingMessage.
      * @return void 
	 */
	this.onRequest = function(request, response){
		//extend request and response via mixin
		util.mixin(request,  protocol.RequestMixIn);
		util.mixin(response, protocol.ResponseMixIn);		
		dispatcher.dispatch(request, response);
	};
	
	/**
	 * Starts the server listening on given port. 
     *                  
     * @param port Specifies the port the server listens to.
     *
     * @return void 
	 */
	this.listen = function(port){
		console.log("startting server on port " + port + "");

		//dont crash the webserver on uncaught exceptions
		process.on('uncaughtException', function(err) {
			console.error(err.stack);
		});
		  
		//run the server
		http.createServer(this.onRequest).listen(port);		
	};
};

exports.Server = Server;