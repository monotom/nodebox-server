var url  	= require("url"),
	moo = require('mootools'); //extend string class

var log = function(msg){
	console.log('+++server.routing::'+msg);
};

exports.Dispatcher  = function(router){
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

exports.Router = function(map){
	this.getHandler = function(request){
		var path = url.parse(request.url).pathname;
		
		return tryDirectRoute(path, request)
		    || tryRegexpRoute(path, request);
	};
	
	var tryDirectRoute =  function(path, request){
		if(map.hasOwnProperty(path)
		&& map[path].hasOwnProperty(request.method)
		&& typeof map[path][request.method] === 'function') 
			return { handle: map[path][request.method],
				 	 path:    path};
		
		return false;
	};

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