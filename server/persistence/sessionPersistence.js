var orm = require('../orm');

exports.addSession = function (sessionID, userID, roomID, callback)
{
    var sessionModel = orm.model('session');

    sessionModel.build(
        {
            id: sessionID,
            room_id: roomID,
            user_id: userID
        }).save().error(function(err)
        {
            return callback(err);

        }).success(function(result)
        {
            return callback(null);
        });
}

// Returns any error
exports.removeSessionByID = function(sessionID, callback)
{
    var sessionModel = orm.model('session');

    sessionModel.find({where: { id: sessionID }}).error(function(error)
    {
        return callback(error);

    }).success(function(session)
        {
            if (!session)
            {
                return callback(null);
            }

            session.destroy().error(function(err)
            {
                return callback(err);

            }).success(function()
            {
                return callback(null);
            })
        });
}

exports.removeSessionByUserID = function(userID, callback)
{
    var sessionModel = orm.model('session');

    sessionModel.find({where: { user_id: userID }}).error(function(error)
    {
        return callback(error);

    }).success(function(session)
        {
            if (!session)
            {
                return callback(null);
            }

            session.destroy().error(function(err)
            {
                return callback(err);

            }).success(function()
                {
                    return callback(null);
                })
        });
}

exports.updateSessionRoomID = function(sessionID, roomID, callback)
{
    var sessionModel = orm.model('session');

    var parameters =
    {
        room_id: roomID
    }

    var criteria =
    {
        id: sessionID
    }

    sessionModel.update(parameters, criteria).error(function(error)
    {
        return callback(error);

    }).success(function()
        {
            return callback(null);
        });
}

exports.getSession = function(sessionID, callback)
{
    var sessionModel = orm.model('session');

    sessionModel.find({where: { id: sessionID }}).error(function(error)
    {
        return callback(error);

    }).success(function(session)
        {
            if (!session)
            {
                return callback(null, null);
            }

            return (callback(null, session.dataValues))
        });
}