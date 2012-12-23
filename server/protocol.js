url		 = require("url"),
formidable 	= require("formidable"),
fs 			= require("fs"),
util		= require("util");

exports.RequestMixIn ={
	getParam : function(name){
		var urlObject = url.parse( this.url, true, true );
	  	return urlObject.query.hasOwnProperty(name) ? urlObject.query[name] : null;
	},	
	parseFormData : function(callback, encoding){
		encoding = encoding || 'binary';
		form = new formidable.IncomingForm();
		form.encoding = encoding;
		form.parse(this, callback);	
	}
};

exports.ResponseMixIn = {
	send : function(status, content, contentType, encoding){
		this.writeHead(status, {"Content-Type": contentType});
		this.write(content, encoding);
		this.end();
	},
	sendNotFound : function(text){
		text = text || "404 Not found";
		this.send(404, text, "text/plain");
	},
	send404 : this.sendNotFound,
	sendError : function(error){
		error = error || '500 Server Error';
		this.send(500, error, "text/plain");
	},
	send500 : this.sendError,
	sendText : function (text){
		this.send(200, text, "text/plain");
	},
	sendJSON : function (object){
		this.send(200, JSON.stringify(object), "application/json");
	},	
	sendJSONError : function (object){
		this.send(500, JSON.stringify(object), "application/json");
	},	
	sendHtml : function(body){	
		var content = '<head>'+
	    '<meta http-equiv="Content-Type" '+
	    'content="text/html; charset=UTF-8" />'+
	    '</head>'+
	    '<body>'+
	    body+
	    '</body>'+
	    '</html>';
		
		this.send(200, content, "text/html");
	},	
	sendFile : function(file){
		var stat = fs.statSync(file);
		this.writeHead(200, {
			'Content-Type': 'application/octet-stream', 
		    'Content-Length': stat.size
		});
		  
		var readStream = fs.createReadStream(file);
		util.pump(readStream, this);		  
	}
};