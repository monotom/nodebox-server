var http = require("http"),
    url  = require("url"),
    log  = require("server/log").log;

function start(port, route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("server.onRequest(" + pathname + ")");
    route(handle, pathname, response, request);
  }

  http.createServer(onRequest).listen(port);
  console.log("server.start(port=" + port + ")");
}

exports.start = start;