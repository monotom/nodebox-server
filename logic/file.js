var moo      = require('mootools');

//TODO sny with storage events

exports.File = new Class({
    Implements: Events,
    initialize: function(options){
        //TODO set options to props
    },
    complete: function(){
        this.fireEvent('complete');
    },
    getUrl : function(){
    	
    },
	path	: './',
	size	: 0,   	    	//file information about the file which the item represents
	version : null,			//file version
	created : 0,			//date file was created
	changed	: 0,			//date of last file change
	status  : 'new',		//new|uploading|available|error	
	lock    : {
		active : false,		//date when the user begun's to lock
		user   : null, 		//username who has the file locked
		started: 0			//is the file locked
	}
});