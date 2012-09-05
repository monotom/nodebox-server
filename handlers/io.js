var querystring = require("querystring"),
    fs 			= require("fs"),
    formidable 	= require("formidable"),
    log 		= require("logic/log").log,
    config 		= require("config"),
    protocol 	= require("server/protocol");

exports.send = function(response, request){
	  log("send()");
	  
	  var path = "/tmp/test.png",
	  encoding = "binary",
	  callback = function(error, file) {
		    if(error) {
			      protocol.send500();
			} else {
			      protocol.sendFile(file, mime="image/png", encoding="binary");
			}
	  };	  
	  fs.readFile(path, encoding, callback);
};

exports.recive = function(response, request){
	  log("recive()");
	  
	  var path = "/tmp/test.png",	  
	  form 	   = new formidable.IncomingForm(),
	  callback = function(error, fields, files) {
		  log("recive() -> parsing done");
		  fs.rename(files.upload.path, path, function(err) {
			  if (err) {
				  fs.unlink("/tmp/test.png");
				  fs.rename(files.upload.path, "/tmp/test.png");
		  		}
		  });
		  protocol.sendText(response, "received image:<br/><img src='/show' />");
	  };	  
	  form.parse(request, callback);	
};

exports.remove = function(response, request){
	  console.log("io.remove()");
	  
	  var path = '/tmp/hello',
	  callback = function (err) {
		  if (err) throw err;
			  console.log('successfully deleted /tmp/hello');
		  };	  
	  if(fs)
		  fs.unlink(path, callback);
	  //TODO check if folder fs.rmdir(path, callback);
	
};
exports.copy = function(response, request){
	  log("copy()");
	
};
exports.move = function(response, request){
	  log("move()");
	  
	  var path = "old", 
      newPath  = "new", 
      callback = function (err) {
		  if (err) throw err;
		  console.log('move() -> complete');
	  };		
	  fs.rename(path, newPath, callback);	
};

exports.mkdir = function(response, request){
	  log("mkdir()");
	  
	  var path = "any", 
	  mode     = 666, 
	  callback = function (err) {
		  if (err) throw err;
		  console.log('mkdir() -> complete');
	  };			
	  fs.mkdir(path, mode, callback);
};

exports.info = function(response, request){
	  console.log("io.info()");
	  
	  fs.stat('/tmp/world', function (err, stats) {
		  if (err) throw err;
		  	console.log('stats: ' + JSON.stringify(stats));
	  });
	  
	  /*{ dev: 2049,
  ino: 305352,
  mode: 16877,
  nlink: 12,
  uid: 1000,
  gid: 1000,
  rdev: 0,
  size: 4096,
  blksize: 4096,
  blocks: 8,
  atime: '2009-06-29T11:11:55Z',
  mtime: '2009-06-29T11:11:40Z',
  ctime: '2009-06-29T11:11:40Z' }*/
	  
	  //TODO fs.readdir(path, [callback])
	  
  /*stats.isFile()
stats.isDirectory()
stats.isBlockDevice()
stats.isCharacterDevice()
stats.isSymbolicLink() (only valid with fs.lstat())
stats.isFIFO()
stats.isSocket()*/
};

/*
fs.watchFile(filename, [options], listener)

Watch for changes on filename. The callback listener will be called each time the file is accessed.

The second argument is optional. The options if provided should be an object containing two members a boolean, persistent, and interval, a polling value in milliseconds. The default is { persistent: true, interval: 0 }.


fs.watchFile(f, function (curr, prev) {
  console.log('the current mtime is: ' + curr.mtime);
  console.log('the previous mtime was: ' + prev.mtime);
});

unwatchFile
*/





/*OLD: 
function start(response) {
  console.log("request::start()");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}*/