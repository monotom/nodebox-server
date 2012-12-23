var log = function(msg){
	console.log('models.db::'+msg);
};

var DbModel = function(collection, db){
	this.find = function(criteria, callback){
		var internCallback = function(err, users) {
			if(callback) callback(err, users);
		};
		db[collection].find(criteria, internCallback);
	};
	
	this.save = function(data, callback){
		this.update('', data, callback);
	};
	
	this.update = function(key, data, callback){
		key = key || '';
		var internCallback = function(err, updated) {
			if(callback) callback(err, updated);
		};
		db[collection].update(key,  {$set: data, }, { upsert: true } , internCallback);
	};
	
	this.remove = function(key, callback){
		var internCallback = function(err, deleted) {
			if(callback) callback(err, deleted);
		};
		db[collection].remove(key,  internCallback);
	};
};

exports.DbModel = DbModel;