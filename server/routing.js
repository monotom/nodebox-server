var url  	= require("url"),
	moo 	= require('mootools'),//extend string class
	log		= require('../logic/util').getLogger('+++server.routing::'); 

/**
* @author Tom Hanoldt
* @class This Class dispatches the client request and calls a handler for processing and response generation.
* @param router The router for finding the route to the handler which should process the request.
* @see Router 
*/
var Dispatcher  = function(router){
	/**
	* Dispatches the request and uses the router for finding a handler. If no handler was found, a HTTP 404 message is sent to the client. If a handler method was found path, request, response are passed to that method.
    *
    * @param request The request from type IncommingMessage is passed to the handler if found.
    * @param response The response from type OutgoingMessage is passed to the handler if found.
    *
    * @return Boolean True if a handler was found, false otherwise.
	*/
	this.dispatch = function(request, response) {	
	  log('dispatching url: '+request.url);
	  
	  var handler = router.getHandler(request);
	  if(!handler){
		  response.sendNotFound(response);
		  return false;
	  }
	  handler.handle(handler.path, request, response);
	  return true;
	};
};

/**
 * @author Tom Hanoldt
 * @class This Class tries to find a handler for a request based on a url - handler map.
 * @param  map A object which's keys are url regexp pattern and which's values are methods for dispatching the request.
 * @see Router 
 */
var Router = function(map){
	/**
	* Tries to find a handler method for the request based on the map data. 
    *
    * @param request The request containing the path to match against the map.
    * 
    * @return Object | false If a handler was found an object is returned containing a handle to the method(key = handle) and the result of the path regexp match(key = path).
	*/
	this.getHandler = function(request){
		var path = url.parse(request.url).pathname;
		
		return tryDirectRoute(path, request)
		    || tryRegexpRoute(path, request);
	};
	
	/**
	* Tries to find a handler method for the request matching the exact path against the key of the map and the request method.
    *
    * @param path The path to match.
    * @param request The request send from the client.
    * 
    * @return Object | false If a handler was found an object is returned containing a handle to the method(key = handle) and the result of the path regexp match(key = path).
	*/
	var tryDirectRoute =  function(path, request){
		if(map.hasOwnProperty(path)
		&& map[path].hasOwnProperty(request.method)
		&& typeof map[path][request.method] === 'function') 
			return { handle: map[path][request.method],
				 	 path:    path};
		
		return false;
	};

	/**
	* Tries to find a handler method for the request matching the path as regexp pattern against the key of the map and the request method.
    *
    * @param path The path to match.
    * @param request The request send from the client.
    * 
    * @return Object | false If a handler was found an object is returned containing a handle to the method(key = handle) and the result of the path regexp match(key = path).
	*/
	var tryRegexpRoute = function(path, request){	
		for(var urlMatch in map){
			var regExp = new RegExp(urlMatch);

			//test is a route matches and has definition for the requestet method
			if(!path.test(regExp, 'i')
			|| !map[urlMatch].hasOwnProperty(request.method))
				continue ;
				
			//if the route contains a match expression like ...(.*) match for an pass as path
			if(urlMatch.indexOf('(') != -1){
				var matches = path.match(regExp);
				if(matches[1])
					path = matches[1];
			}
			
			return { handle: map[urlMatch][request.method],
					 path:    path};
		}
		return false;
	};
};

exports.Dispatcher = Dispatcher;
exports.Router = Router; 