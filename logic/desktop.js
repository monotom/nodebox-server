var moo      = require('mootools'),
    log      = require("../server/log").log,
    Item     = require("../logic/item").Item;


exports.Desktop = new Class({
    Implements: Item,
    initialize: function(user){
        this.user = user;
    },
    remove
    save
    
});

Desktop.loadByName(desktopName);
		
DesktopMapper.addUserToDestop(user, desktop, callback);
DesktopMapper.hasUserAccess(user, desktop, callback);
DesktopMapper.removeUserFromDestop(user, desktop, callback);