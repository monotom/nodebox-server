var moo      = require('MooTools'),
    Object   = moo.Object,
    String   = moo.String,
    log      = require("server/log").log,
    protocol = require("server/protocol");

exports.dispatchUrl = function(pathMap, path, response, request) {
  if(!trySimpleRoute(pathMap, path, response, request)) {
	  log("router.routeSimple(" + path + ") -> route");
	  return ;
  }   
  log("router.routeSimple(" + path + ") -> No request handler found");
  protocol.send404(response);
};

exports.dispatcheRest = function(methodPathMap, path, response, request) {
	if(tryRestRoute(methodPathMap, path, response, request)){
		log("router.routeRest(" + path + ") -> route");	    
		return ;
	}	
	log("router.routeRest([" + method + "]/" + path + ") -> No request handler found");
	protocol.send404(response);
};

function trySimpleRoute(pathMap, path, response, request){
	if(typeof pathMap !== "undefined"
	&& typeof pathMap[path] === 'function') {
		pathMap[path](response, request);
		return true;
	}
	return false;
};

function tryRestRoute(pathMethodMap, path, response, request){
	if(typeof pathMethodMap === "undefined")
		return false;
	
	if(typeof pathMethodMap[path]
	&& typeof pathMethodMap[path][request.method] === 'function') {
		pathMethodMap[path][request.method](path, '', response, request);
		return true;
	}
	
	for(var urlMatch in pathMethodMap){
		if(!path.test(urlMatch, 'i')
		|| typeof element[urlMatch] == "undefined"
		|| typeof element[urlMatch][request.method] !== "function")
			continue ;
						
		element[urlMatch][request.method](path, path.substr(path.length-1), response, request);
		return true;
	}
	return false;
};