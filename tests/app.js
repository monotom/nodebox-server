var app  = require("../logic/app").app,
	User = require("../logic/user").User;

var log = function(msg){
	console.log('tests.app::'+msg);
};

user = new User();
user.name = 'mono4';
user.setPassword('pwd3');
user.save();

app.authenticateUser('mono4', 'pwd3', function(err, user){
	if(err){
		log(err);
		return ;
	}
	else{
		log(user);
		app.loadDesktop(user, 'desktop', function (err, desktop){
			if(err){
				log(err);
				return ;
			}
			log('desktop loaded: '+desktop);
		});
	}
});



