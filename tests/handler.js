var User = require("../logic/user").User,
    app  = require("../logic/app").app,
	util = require('../logic/util'),
	log  = util.getLogger('tests.app::');

var HandlerTest = function(){
	    this.setUp = function (callback) {
	        callback();
	    };
	    
	    this.tearDown = function (callback) {
	        callback();
	    };
	};

module.exports = new HandlerTest();