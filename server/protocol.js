
exports.send404 = function(response){
	response.writeHead(404, {"Content-Type": "text/html"});
	response.write("404 Not found");
	response.end();
};

exports.send500 = function(response){
	response.writeHead(500, {"Content-Type": "text/plain"});
	response.write(error + "\n");
	response.end();
};

exports.sendFile = function (response, file, mime, encoding){
	response.writeHead(200, {"Content-Type": mime});
	response.write(file, encoding);
	response.end();
};

exports.sendText = function (response, text){
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(text);
	response.end();
};

exports.sendHtml = function(body){	
	var content = '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    body+
    '</body>'+
    '</html>';
	
	exports.sendText(content);
};