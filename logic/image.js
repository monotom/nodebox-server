var moo      = require('mootools'),
	File	 = require('../logic/file').File;


exports.Image = new Class({
    Implements: File,
    initialize: function(options){
        //TODO set options to props
    },
    complete: function(){
        this.fireEvent('complete');
    },  
    y				: 0,
	width			: '100%',
	height			: '100%',
	scale			:{
						x : 1,
						y : 1
					},
	bacgroundColor  : "red",
	transparency	: 1
});
