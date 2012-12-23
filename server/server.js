var http     = require("http"),
	protocol = require("./protocol"),
	util	 = require("../logic/util");

var log = function(msg){
	console.log('server.server::'+msg);
};

/*
 *@namespace server
 *@author Tom Hanoldt
 *@class this class wraps the server logic and controlls the client request dispatching
 */

exports.Server = function(dispatcher){
     /* @property private dispatcher from type server.routing.Dispatcher 
      * @see type server.routing.Dispatcher */

     /*
	 *@method onRequest called, whenever a client requestinf the port the server runs on
      *                  also mixes the request/response extension into request an response
      *@param request from type IncommingMessage 
      *@param response from type OutgoingMessage
      *@return void 
	 */
	this.onRequest = function(request, response){
		//extend request and response via mixin
		util.mixin(request,  protocol.RequestMixIn);
		util.mixin(response, protocol.ResponseMixIn);		
		dispatcher.dispatch(request, response);
	};
	
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