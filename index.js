var Server  	= require("./server/server").Server,
	Router  	= require("./server/routing").Router,	
	Dispatcher  = require("./server/routing").Dispatcher,	
	
	AuthHandler = require('./handlers/auth').AuthHandler,
	IoHandler   = require('./handlers/io').IoHandler,
	InfoHandler = require('./handlers/info').InfoHandler,
	AccountHandler = require('./handlers/account').AccountHandler;


/**
* @author Tom Hanoldt
*/
var routingMap = {
	"account/info": { "GET"	: AccountHandler.info },	
	"auth"					: { "POST"	: AuthHandler.login },
	
	"io(.*)\\?{0,1}.*"		: { "GET"	: IoHandler.send,
								"PUT" 	: IoHandler.recive,
								"DELETE": IoHandler.remove,
								"MKCOL" : IoHandler.mkdir},//TODO
							
	"info/metadata(.*)\\?{0,1}.*": { "GET"	: InfoHandler.getMetadata},
	"info/changed(.*)\\?{0,1}.*" : { "GET"	: InfoHandler.getChanged}		
};

var router = new Router(routingMap);

var dispatcher = new Dispatcher(router);

var server = new Server(dispatcher);

server.listen(require('./config').server.port);
