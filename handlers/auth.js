var moo      = require('MooTools'),
    Object   = moo.Object,
    String   = moo.String,
    log      = require("server/log").log,
    protocol = require("server/protocol"),
    url		 = require("url");



exports.request = function(response, request) {
	log("auth.request()");
	
	var urlObject = url.parse(request.url, parseQueryString=true),
	    userName = urlObject.query['username'],
	    userPass = urlObject.query['userpass'];
	
	protocol.sendText('token_secret=b9q1n5il4lcc&token=mh7an9dkrg59');
};

exports.authorize = function(response, request) {
	log("auth.authorize()");
	/*in: oauth_token
	
	out: oauth_token The request token that was just authorized. The request token secret isn't sent back.
	uid The user's unique Dropbox ID.
	 */
};
	
exports.access = function(response, request) {
	log("auth.access()");
		 
};
	
/*
oauth_consumer_key:
 The Consumer Key. 
oauth_signature_method:
 The signature method the Consumer used to sign the request. 
oauth_signature:HMAC-SHA1|RSA-SHA1|PLAINTEXT
oauth_timestamp:
 As defined in Nonce and Timestamp. 
oauth_nonce:
 As defined in Nonce and Timestamp. 
oauth_version:
 OPTIONAL. If present, value MUST be  1.0 . Service Providers MUST assume the protocol version to be 1.0 if this parameter is not present. Service Providers’ response to non-1.0 value is left undefined.
*/