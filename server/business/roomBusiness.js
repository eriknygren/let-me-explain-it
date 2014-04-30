var sessionPersistence = require('../persistence/sessionPersistence');
var roomPersistence = require('../persistence/roomPersistence');
var sessionBusiness = require('./sessionBusiness');
var util = require('../helpers/util');
var uuid = require('node-uuid');
var validator = require('validator');

exports.setupRoom = function(roomName, sessionID, callback)
{
    var results =
    {
        success: true,
        sessionID: "",
        roomID: "",
        isRegisteredUser: false,
        userID: 0
    };

    // check if room exists
    roomPersistence.getRoomIDByRoomName(roomName, function(err, roomID)
    {
        if (err)
        {
            results.success = false;
            return callback(results);
        }

        if (util.isNullOrUndefined(roomID))
        {
            createRoom(roomName, onRoomSetUpHandler);
        }
        else
        {
           onRoomSetUpHandler(null, roomID);
        }
    });

    function onRoomSetUpHandler(err, roomID)
    {
        if (err)
        {
            results.success = false;
            return callback(results);
        }

        results.roomID = roomID;

        if (util.isNullOrUndefined(sessionID))
        {
            sessionID = uuid.v4();

            sessionPersistence.addSession(sessionID, null, roomID, onSessionSetUpHandler);
        }
        else if (typeof sessionID !== 'string')
        {
            sessionID = uuid.v4();

            sessionPersistence.addSession(sessionID, null, roomID, onSessionSetUpHandler);
        }
        else
        {
            sessionPersistence.getSession(sessionID, function(err, session)
            {
                if (err)
                {
                    results.success = false;
                    return callback(results);
                }

                if (!session)
                {
                    sessionID = uuid.v4();

                    sessionPersistence.addSession(sessionID, null, roomID, onSessionSetUpHandler);
                }
                else
                {
                    if (!util.isNullOrUndefined(session.user_id))
                    {
                        results.isRegisteredUser = true;
                        results.userID = session.user_id;
                    }
                    sessionPersistence.updateSessionRoomID(sessionID, roomID, onSessionSetUpHandler);
                }
            })
        }

        function onSessionSetUpHandler(err)
        {
            if (err)
            {
                results.success = false;
                return callback(results);
            }

            results.sessionID = sessionID;
            return callback(results);
        }
    }
};

exports.validateRoomName = function(roomName)
{
    var result = _validateRoomName(roomName);

    return result;
}


exports.joinRoomRequest = function(req, res)
{
    var roomName = req.body.roomName;

    var validationResult = _validateRoomName(roomName);

    if (!validationResult.valid)
    {
        res.send(400, validationResult.message);
        return;
    }

    res.send(200, 'proceed to join room');
};

function createRoom(roomName, callback)
{
    roomPersistence.addRoom(roomName, function(err, roomID)
    {
        if (err)
        {
            console.log(err);
            return callback(err);
            //res.send(500, 'Error');
        }

        return callback(null, roomID);
    });
}

function _validateRoomName(roomName)
{
    var result =
    {
        valid: true,
        message: ""
    }

    if (util.isNullOrUndefined(roomName))
    {
        result.message += 'Room name supplied was blank';
        result.valid = false;
        return result;
    }

    if (roomName == null || roomName == '')
    {
        result.message += 'Room name supplied was blank';
        result.valid = false;
        return result;
    }

    if (!validator.isAlphanumeric(roomName))
    {
        result.message += 'Room name can only contain alphanumeric characters';
        result.valid = false;
        return result;
    }

    if (!validator.isLength(roomName, 1, 30))
    {
        result.message += 'Room name needs to be between 1 and 30 characters';
        result.valid = false;
        return;
    }

    return result;
}
