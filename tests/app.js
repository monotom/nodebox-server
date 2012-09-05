var app  = require("../logic/app").app,
	User = require("../logic/user").User,
	log  = require("../server/log").log;


app.authenticateUser('mono2', 'pwd', function(err, user){
	if(err){
		log(err);
		return ;
	}
	else{
		log(user);
		app.loadDesktop(user.sessionKey, 'desktop', function (err, desktop){
			if(err){
				log(err);
				return ;
			}
			log(desktop);
		});
	}
});



