var config  = require('./config'),	
	server  = require("./server/server"),
	router  = require("./server/router"),	
	oauth   = require('./handlers/oauth'),
	io      = require('./handlers/io'),
	info    = require('./handlers/info'),
	account = require('./handlers/account');

var restMap = {
		"oauth/request" 	: { "POST"	: auth.request },	
		"oauth/authorize"	: { "GET"	: auth.authorize },	
		"oauth/access"		: { "POST"	: auth.access },	
		
		"account/info"		: { "GET"	: account.info },	
		
		"io/*"				: { "GET"	: io.send,
								"POST" 	: io.recive,
								"DELETE": io.remove,
								"COPY"	: io.copy,
								"MOVE"	: io.move,
								"MKCOL" : io.mkdir},
								
		"info/metadata/*"	: { "GET"	: info.getMetadata},
		"info/changed/*"	: { "GET"	: info.hasChanged}		
};


server.start(router.dispatcheRest, restMap, config.server.port);


/*
TODO: 
info/metadata/<root>/<path>
info/changed/<root>/<path>
info/revisions/<root>/<path>
info/search/<root>/<path>
info/shares/<root>/<path>
info/media/<root>/<path>
info/link/<root>/<path>
info/thumbnail<root>/<path>
*/