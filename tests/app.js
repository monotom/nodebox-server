var User = require("../logic/user").User,
    app  = require("../logic/app").app,
	util = require('../logic/util'),
	fs   = require('fs'),
	log  = util.getLogger('tests.app::');

var user = null,
	relativeDesktopFolderPath = '/dir1/dir2/dir3',
	localDesktopFolderPath = null,
	relativeDesktopFilePath = '/test.txt',
	localDestopFilePath = null;

/**
* @author Tom Hanoldt
* @class This is a test object for nodeunit testing the functionality of logic.app, logic.user, logic.desktop, models.io, models.db. 
* 
*/
var ApplicationTest = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },   
    /** 
     * Create a User object and store it.
     */
    testCreateUser : function (test) {
    	user = new User({}, app.getUserModel());
    	user.name = util.uniqueKey('usertest');
    	user.setPassword('pwd');
    	user.save(function(err){
    		test.equals(err, null);
	        test.done();
    	});
    },   
    /** 
     * Authenticate a user object against the app object.
     */
    testAuthenticateUser : function (test) {
    	app.authenticateUser(user.name, 'pwd', function(err, _user){
    		test.equals(err, null);
    		test.notEqual(_user.sessionKey);
    		user = _user;
    		test.done();
    	});
    },
    /** 
     * Get account information about a User object.
     */
    testGetAccountInfo : function (test) {
    	app.getAccountInfo(user.sessionKey, function(err, info){
    		test.equals(err, null);
    		test.notEqual(info, null);
    		test.done();
    	});
    },  
    /** 
     * Get metadata for the root folder of a desktop.
     */
    testGetRootMetadata : function (test) {
    	app.getMetadata(user.sessionKey, '', function(err, file){
    		test.equals(err, null);
    		test.notEqual(file, null);
    		test.done();
    	});
    },
    
    /** 
     * Get the local storage path for a file within a desktop.
     */
    testGetFileLocation : function (test) {
    	app.getFileLocation(user.sessionKey, relativeDesktopFilePath, function(err, path){
    		test.equals(err, null);
    		test.notEqual(path, null);
    		localDestopFilePath = path;
    		test.done();
    	});
    },    
    /** 
     * Create a file on the users desktop.
     */
    testCreateFile : function (test) {
    	if(!localDestopFilePath) return	test.done();
    	
    	fs.writeFile(localDestopFilePath, "nodev1.test.app.js::test file", function(err) {
    		test.equals(err, null);
    		test.done();
    	}); 
    },    
    /** 
     * Get metadata for the created file.
     */
    testGetFileMetadata : function (test) {
    	if(!localDestopFilePath) return	test.done();
    	
    	app.getMetadata(user.sessionKey, relativeDesktopFilePath, function(err, file){
    		test.equals(err, null);
    		test.notEqual(file, null);
    		test.done();
    	});
    },  
    /** 
     * Delete the created file.
     */
    testDeleteFile : function (test) {
    	if(!localDestopFilePath) return	test.done();
    	app.removeFileFromDesktop(user.sessionKey, relativeDesktopFilePath, function(err, file){
    		test.equals(err, null);
    		test.notEqual(file, null);
    		test.done();
    	});
    },
    
    /** 
     * Get the local storage path for a directory tree. 
     */
    testGetDirectoryPath : function (test) {
    	app.getFileLocation(user.sessionKey, relativeDesktopFolderPath, function(err, path){
    		test.equals(err, null);
    		test.notEqual(path, null);
    		localDesktopFolderPath = path;
    		test.done();
    	});
    },  
    /** 
     * Create the directory tree.
     */
    testCreateDirectoryTree : function (test) {
    	if(!localDesktopFolderPath) return	test.done();
    	app.createDirectory(user.sessionKey, relativeDesktopFolderPath, function(err, object){
    		test.equals(err, null);
    		test.notEqual(object, null);
    		test.done();
    	});
    },    
    /** 
     * Get metadata of the directory tree.
     */
    testGetDirectoryMetadata : function (test) {
    	if(!localDesktopFolderPath) return	test.done();
    	
    	app.getMetadata(user.sessionKey, relativeDesktopFolderPath, function(err, file){
    		test.equals(err, null);
    		test.notEqual(file, null);
    		test.done();
    	});
    },
    /** 
     * Delete the directory tree.
     */
    testDeleteDirectory : function (test) {
    	if(!localDestopFilePath) return	test.done();
    	app.removeFileFromDesktop(user.sessionKey, relativeDesktopFolderPath, function(err, file){
    		test.equals(err, null);
    		test.notEqual(file, null);
    		test.done();
    	});
    },
    /** 
     * Delete the previous created user and related data. 
     */
    testDeleteUserAndDesktop : function (test) {
    	app.removeUserBySessionKey(user.sessionKey, function(err){
    		test.equals(err, null);
    		test.done();
    	});
    }
};

module.exports.group = ApplicationTest;