var log		= require('../logic/util').getLogger('models.db::');

/**
* @author Tom Hanoldt
* @class Handles access of persitent storage for operative data.
* 
*  @param collection The next structural element inside the db. Can be compared with a table in a sql database.
*  @param db The mongodb connection object to a database.
*/
var DbModel = function(collection, db){
   /**
	* Find a object record in the collection.
    *                  
    * @param criteria An object containig keys and values describing the object properties to match.
    * @param callback A method called when the search is finished. Parameters passed to the method are error(String) and results(Array).
    *
    * @return void
	*/
	this.find = function(criteria, callback){
		var internCallback = function(err, users) {
			if(callback) callback(err, users);
		};
		db[collection].find(criteria, internCallback);
	};
	
   /**
	* Saves a object. if the object allready exists and the unique key _id exist in the data object, the record is update.
    *                  
    * @param data An object containig the data.
    * @param callback A method called when the save is finished. Parameter passed to the method is error(String).
    *
    * @return void
	*/
	this.save = function(data, callback){
		this.update('', data, callback);
	};
	
	/**
	* Updates a object.
    *                  
    * @param key The unique key identifying the object.                
    * @param data An object containig the data.
    * @param callback A method called when the save is finished. Parameter passed to the method is error(String).
    *
    * @return void
	*/
	this.update = function(key, data, callback){
		key = key || '';
		var internCallback = function(err, updated) {
			if(callback) callback(err, updated);
		};
		db[collection].update(key,  {$set: data, }, { upsert: true } , internCallback);
	};
	
	/**
	* Deletes a object.
    *                  
    * @param key The unique key identifying the object              
    * @param callback A method called when the save is finished. Parameter passed to the method is error(String).
    *
    * @return void
	*/
	this.remove = function(key, callback){
		var internCallback = function(err, deleted) {
			if(callback) callback(err, deleted);
		};
		db[collection].remove(key,  internCallback);
	};
};

exports.DbModel = DbModel;