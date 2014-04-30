var sessionPersistence = require('../persistence/sessionPersistence');
var uuid = require('node-uuid');

exports.setupGuestSession = function(roomID, callback)
{
    var guestSessionID = uuid.v4();

    sessionPersistence.addSession(guestSessionID, null, roomID, function(err)
    {
        if (err)
        {
            console.log(err)
        }

        return callback(err, guestSessionID);
    });
}
