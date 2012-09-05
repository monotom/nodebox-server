var moo      = require('mootools')
	Image	 = require("../logic/image").Image,
	File	 = require("../logic/file").File;


exports.Item = new Class({
    Implements: Events,
    initialize: function(options){
        //TODO set options to props
    },
    complete: function(){
        this.fireEvent('complete');
    },
    
    name : 		"item",				//dislay name on client
	info : 		"item info",		//baloon informagtion for this file
	command : 	"executeNative",	//client command executeNative=[params]|openWithPlugin=[plugin]
	
	image : new Image(),
	file  : new File(),	
});

/*
class ItemManager
	instance
	create
	get
	update
	remove
	search
*/