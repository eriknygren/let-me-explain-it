var orm = require('../orm');
var uuid = require('node-uuid');

exports.addRoom = function(roomName, callback)
{
    var roomModel = orm.model('room');
    var roomID = uuid.v4();

    roomModel.build(
        {
            id: roomID,
            name: roomName
        }).save().error(function(err)
        {
            return callback(err);

        }).success(function(result)
            {
                return callback(null, roomID);
            });
}

exports.removeRoomByID = function(roomID, callback)
{
    var roomModel = orm.model('room');

    roomModel.find({where: { id: roomID }}).error(function(error)
    {
        return callback(null);
    }).success(function(room)
    {
        if (!room)
        {
            return callback(null);
        }

        room.destroy().error(function(err)
        {
            console.log(err);
            return callback('removing room failed');

        }).success(function()
            {
                return callback(null);
            })
    });
}

exports.getRoomIDByRoomName = function(roomName, callback)
{
    var roomModel = orm.model('room');
    roomModel.find({attributes: ['id'], where: { name: roomName }})
        .error(function(err)
        {
            return callback(err);

        }).success(function(result)
            {
                if (!result)
                {
                    return callback(null, null);
                }

                return callback(null, result.dataValues.id);
            });
}

exports.checkRoomID = function(id, callback)
{
    var roomModel = orm.model('room');
    roomModel.find({attributes: ['id'], where: { id: id }})
        .error(function(err)
        {
            return callback(err);

        }).success(function(result)
        {
            if (!result)
            {
                return callback(null, null);
            }

            return callback(null, result.dataValues.id);
        });
}