var orm = require('../orm');

exports.getUserDataByName = function (username, callback)
{
    var userModel = orm.model('user');

    userModel.find({where: { name: username }}).error(function(error)
    {
        return callback(error);

    }).success(function(user)
        {
            if (!user)
            {
                return callback(null, null);
            }

            return (callback(null, user.dataValues))
        });
}

exports.getUserDataByEmail = function (email, callback)
{
    var userModel = orm.model('user');

    userModel.find({where: { email: email }}).error(function(error)
    {
        return callback(error);

    }).success(function(user)
        {
            if (!user)
            {
                return callback(null, null);
            }

            return (callback(null, user.dataValues))
        });
}

exports.getUserDataByID = function (id, callback)
{
    var userModel = orm.model('user');

    userModel.find({where: { id: id }}).error(function(error)
    {
        return callback(error);

    }).success(function(user)
        {
            if (!user)
            {
                return callback(null, null);
            }

            return (callback(null, user.dataValues))
        });
}

exports.addUser = function (username, email, password, callback)
{
    var userModel = orm.model('user');

    userModel.build(
        {
            name: username,
            email: email,
            password: password
        }).save().error(function(err)
        {
            return callback(err);

        }).success(function(user)
        {
            return callback(null, user);
        });
}

exports.updateUserDetails = function (id, username, email, callback)
{
    var userModel = orm.model('user');
    var parameters =
    {
        name: username,
        email: email
    }

    var criteria =
    {
        id: id
    }

    userModel.update(parameters, criteria).error(function(error)
    {
        return callback(error);

    }).success(function()
        {
            return callback(null);
        });
}

exports.updateUserPassword = function (id, password, callback)
{
    var userModel = orm.model('user');

    var parameters =
    {
        password: password
    }

    var criteria =
    {
        id: id
    }

    userModel.update(parameters, criteria).error(function(error)
    {
        return callback(error);

    }).success(function()
        {
            return callback(null);
        });
}

exports.updateUserPicturePath = function (id, path, callback)
{
    var userModel = orm.model('user');

    var parameters =
    {
        picture: path
    }

    var criteria =
    {
        id: id
    }

    userModel.update(parameters, criteria).error(function(error)
    {
        return callback(error);

    }).success(function()
        {
            return callback(null);
        });
}