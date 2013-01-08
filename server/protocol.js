url		 = require("url"),
formidable 	= require("formidable"),
fs 			= require("fs"),
util		= require("util");

/**
* @author Tom Hanoldt
* @class This class is meant to extend the request object, send from a client, with functionality for parsing parameters and forms.
 */
var RequestMixIn = function(){
   /**
	* Extracts a parameter value from the actual request.
    *                  
    * @param name The name of the parameter.
    *
    * @return String | null The value of the parameter or null if not present.
	*/
	this.getParam = function(name){
		var urlObject = url.parse( this.url, true, true );
	  	return urlObject.query.hasOwnProperty(name) ? urlObject.query[name] : null;
	};
	
   /**
	* Parses the incoming form within the actual request. So it is possible to access files send with the form for example. 
    *                  
    * @param callback The method called after the form is parsed. Theses method gets three parameters: error, fields, files
    * @param encoding The encoding with which the form is encoded.
    *
    * @return void 
	*/
	this.parseFormData = function(callback, encoding){
		encoding = encoding || 'binary';
		form = new formidable.IncomingForm();
		form.encoding = encoding;
		form.parse(this, callback);	
	};
};

/**
* @author Tom Hanoldt
* @class  This class is meant to extend the response object with functionality for easier sending a result to a client
*/
var ResponseMixIn = function(){
	/**
	* Generic method for sending the response to the client.
    *                  
    * @param status The HTTP status code of the response.
    * @param content The String content of the response.
    * @param contentType The HTTP content type header for indicating the format of the content.
    * @param encoding The encoding the response will be encoded.
    *
    * @return void
	*/
	this.send = function(status, content, contentType, encoding){
		this.writeHead(status, {"Content-Type": contentType});
		this.write(content, encoding);
		this.end();
	};
	
	/**
	* Send an HTTP not found response to the client.
    *                  
    * @param text The text send with the response.
    *
    * @return void
	*/
	this.sendNotFound = function(text){
		text = text || "404 Not found";
		this.send(404, text, "text/plain");
	};
	/**
	* An alias of the sendNotFound method.
    *
    * @see sendNotFound
	*/
	this.send404 = this.sendNotFound;
	
	/**
	* Send an HTTP server error response to the client.
    *
    * @param error The error message text send with the response.
    *
    * @return void
	*/
	this.sendError = function(error){
		error = error || '500 Server Error';
		this.send(500, error, "text/plain");
	};
	/**
	* An alias of the sendError method.
    *
    * @see sendError
	*/
	this.send500 = this.sendError;
	
	/**
	* Send an text to the client indicating that there was no problem during request processing.
    *
    * @param text The message send with the response.
    *
    * @return void
	*/
	this.sendText = function (text){
		this.send(200, text, "text/plain");
	};
	
	/**
	* Send an json encoded object to the client indicating that there was no problem during request processing.
    *
    * @param object The object send with the response.
    *
    * @return void
	*/
	this.sendJSON = function (object){
		this.send(200, JSON.stringify(object), "application/json");
	};
	
	/**
	* Send an json encoded object to the client indicating that there was a server error during processing the request.
    *
    * @param object The object send with the response.
    *
    * @return void
	*/
	this.sendJSONError = function (object){
		this.send(500, JSON.stringify(object), "application/json");
	};
	
	/**
	* Send an HTML formatted response to the client indicating that there was no problem during request processing.
    *
    * @param body The html body content of the message send with the response.
    *
    * @return void
	*/
	this.sendHtml = function(body){	
		var content = '<head>'+
	    '<meta http-equiv="Content-Type" '+
	    'content="text/html; charset=UTF-8" />'+
	    '</head>'+
	    '<body>'+
	    body+
	    '</body>'+
	    '</html>';
		
		this.send(200, content, "text/html");
	};
	
	/**
	* Send an generic file to the client indicating that there was no problem during request processing. The HTTP content type header is 'application/octet-stream'.
    *
    * @param file The local path of the file end with the response.
    *
    * @return void
	*/
	this.sendFile = function(file){
		var stat = fs.statSync(file);
		this.writeHead(200, {
			'Content-Type': 'application/octet-stream', 
		    'Content-Length': stat.size
		});
		  
		var readStream = fs.createReadStream(file);
		util.pump(readStream, this);		  
	};
};



















exports.RequestMixIn = new RequestMixIn();
exports.ResponseMixIn = new ResponseMixIn();