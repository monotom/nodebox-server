module.exports = {
		"server": {
		    "port": 8881,
		    "keyFile":'/etc/ssl/keys/ssl-cert-snakeoil.key',
		    "certFile": '/etc/ssl/certs/ssl-cert-snakeoil.pem'
		},	  
		"db": {
			"url": "127.0.0.1/nodebox",
			"tables"  : ["users", "desktops"] 
		},  
		"app":{
			"autoLogoutUserAfter" : 3600,
			"garbageCollectUser"  : 60,
			"createUserIfNotExists": true
		},
		"io":{
			"basePath":"./FileStore/"
		}
	};