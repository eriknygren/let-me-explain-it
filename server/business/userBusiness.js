var userPersistence = require('../persistence/userPersistence');
var sessionPersistence = require('../persistence/sessionPersistence');
var emailBusiness = require('./emailBusiness');
var fileBusiness = require('./fileBusiness');
var util = require('../helpers/util');
var uuid = require('node-uuid');
var passwordHash = require('password-hash');
var validator = require('validator');

var PATH_TO_CUSTOM_PROFILE_PICTURES = "/images/avatars/";
var DEFAULT_PROFILE_PICTURE = "/images/blank-avatar.jpg";

exports.loginRequest = function(req, res){

    var username = req.body.username;
    var password = req.body.password;
    var remember = req.body.remember;

    if(!username || !password ||
        username === '' || password === '')
    {
        res.send(400, 'Please fill in all fields');
    }

    if(validator.isEmail(username))
    {
        userPersistence.getUserDataByEmail(username, userDataReturnedHandler);
    }
    else
    {
        userPersistence.getUserDataByName(username, userDataReturnedHandler);
    }

    function userDataReturnedHandler(err, results)
    {
        if (err)
        {
            console.log(err);
            res.send(500, 'error');
            return;
        }

        if (util.isNullOrUndefined(results))
        {
            res.send(400, 'Email/username and password combination does not exist.');
            return;
        }

        var hash = results.password;

        if (!passwordHash.verify(password, hash))
        {
            res.send(401, 'Email/username and password combination does not exist.');
            return;
        }

        var sessionID =  uuid.v4();
        var userID = results.id;

        var picture = getPictureOrDefaultPictureFromUser(results);

        var userData =
        {
            name: results.name,
            email: results.email,
            picture: picture
        }

        // Remove any other logged in sessions with this user
        // (Currently not supporting simultaneous sessions for one user account)
        sessionPersistence.removeSessionByUserID(userID, function(err)
        {
            if (err)
            {
                console.log(err);
                res.send(500, 'error');
                return;
            }
            sessionPersistence.addSession(sessionID, userID, 'login', function(err)
            {
                if (err)
                {
                    console.log(err);
                    res.send(500, 'error');
                    return;
                }

                if (remember)
                {
                    res.cookie('token', sessionID, { maxAge: 9000000000});
                }
                else
                {
                    res.cookie('token', sessionID);
                }

                res.send(userData);
            });
        });
    };
};

exports.logoutRequest = function(req, res)
{
    if (typeof req.cookies.token !== "undefined")
    {
        sessionPersistence.removeSessionByID(req.cookies.token, function(err)
        {
            if (err)
            {
                console.log(err);
                res.send(500, 'error');
                return;
            }

            res.clearCookie('token', {path: '/'});
            res.send(200, 'logged out');

        });
    }
    else
    {
        res.send(200, 'no session found');
    }
};

exports.registerUserRequest = function(req, res)
{
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    var emailInputResult = validateEmailInput(email);

    if (!emailInputResult.valid)
    {
        res.send(400, emailInputResult.message);
        return;
    }

    var usernameInputResult = validateUsernameInput(username);

    if (!usernameInputResult.valid)
    {
        res.send(400, usernameInputResult.message);
        return;
    }

    var passwordInputResult = validatePasswordInput(password);

    if (!passwordInputResult.valid)
    {
        res.send(400, passwordInputResult.message);
        return;
    }

    var hash = passwordHash.generate(password, {algorithm: 'sha512'});

    userPersistence.getUserDataByEmail(email, function(err, userByEmail)
    {
        if (err)
        {
            console.log(err);
            res.send(500, 'error');
            return;
        }

        if (!util.isNullOrUndefined(userByEmail))
        {
            res.send(400, 'Email already registered');
            return;
        }

        userPersistence.getUserDataByName(username, function(err, userByName)
        {
            if (err)
            {
                console.log(err);
                res.send(500, 'error');
                return;
            }

            if (!util.isNullOrUndefined(userByName))
            {
                res.send(400, 'Username already registered');
                return;
            }

            userPersistence.addUser(username, email, hash, function(err, user)
            {
                if (err)
                {
                    console.log(err);
                    res.send(500, 'error');
                    return;
                }

                var sessionID =  uuid.v4();
                var userID = user.id;

                var userData =
                {
                    name: username,
                    email: email,
                    picture:  DEFAULT_PROFILE_PICTURE
                }

                sessionPersistence.addSession(sessionID, userID, 'login', function(err)
                {
                    if (err)
                    {
                        console.log(err);
                        res.send(500, 'error');
                        return;
                    }

                    res.cookie('token', sessionID);
                    res.send(userData);
                });
            });
        })

    });


};

exports.editUserDetailsRequest = function(req, res)
{
    var username = req.body.username;
    var email = req.body.email;
    var sessionID = req.cookies.token;

    var emailInputResult = validateEmailInput(email);

    if (!emailInputResult.valid)
    {
        res.send(400, emailInputResult.message);
        return;
    }

    var usernameInputResult = validateUsernameInput(username);

    if (!usernameInputResult.valid)
    {
        res.send(400, usernameInputResult.message);
        return;
    }

    if (typeof sessionID === 'undefined')
    {
        res.send(400, 'Session error: no token supplied');
        return;
    }

    //get user id from session
    sessionPersistence.getSession(sessionID, function(err, result)
    {
        if(util.isNullOrUndefined(result))
        {
            res.send(400, 'Session error: unknown session');
            return;
        }
        if (!result.user_id)
        {
            res.send(400, 'Session error: no related user id');
            return;
        }

        var userID = result.user_id;

        userPersistence.getUserDataByEmail(email, function(err, userByEmail)
        {
            if (err)
            {
                console.log(err);
                res.send(500, 'error');
                return;
            }

            if (!util.isNullOrUndefined(userByEmail))
            {

                if (userByEmail.id !== userID)
                {
                    res.send(400, 'Email already registered');
                    return;
                }
            }

            userPersistence.getUserDataByName(username, function(err, userByName)
            {
                if (err)
                {
                    console.log(err);
                    res.send(500, 'error');
                    return;
                }

                if (!util.isNullOrUndefined(userByName))
                {
                    if (userByName.id !== userID)
                    {
                        res.send(400, 'Username already registered');
                        return;
                    }
                }
                // store new values
                userPersistence.updateUserDetails(result.user_id, username, email, function(err)
                {
                    if (err)
                    {
                        console.log(error);
                        res.send(500, 'error: unable to update details');
                        return;
                    }

                    var userData =
                    {
                        name: username,
                        email: email
                    }

                    res.send(userData);

                });

            });
        });
    });
}

exports.editUserPasswordRequest = function(req, res)
{
    var oldPassword = req.body.oldPassword;
    var password = req.body.password;
    var password2 = req.body.password2;
    var sessionID = req.cookies.token;

    if (password !== password2)
    {
        res.send(400, 'New passwords do not match');
        return;
    }

    var passwordInputResult = validatePasswordInput(password);

    if (!passwordInputResult.valid)
    {
        res.send(400, passwordInputResult.message);
        return;
    }

    if (typeof sessionID === 'undefined')
    {
        res.send(400, 'Session error: no token supplied');
        return;
    }

    //get user id from session
    sessionPersistence.getSession(sessionID, function(err, result)
    {
        if(util.isNullOrUndefined(result))
        {
            res.send(400, 'Session error: unknown session');
            return;
        }

        var userID = result.user_id;

        if (!userID)
        {
            res.send(400, 'Session error: no related user id');
            return;
        }

        userPersistence.getUserDataByID(userID, function(err, user)
        {
            if (err)
            {
                console.log(err);
                res.send(500, 'error');
                return;
            }

            if(util.isNullOrUndefined(user))
            {
                res.send(500, 'error getting user details');
                return;
            }

            var hash = user.password;

            if (!passwordHash.verify(oldPassword, hash))
            {
                res.send(401, 'Old password invalid');
                return;
            }

            var newHash = passwordHash.generate(password, {algorithm: 'sha512'});

            userPersistence.updateUserPassword(userID, newHash, function(err)
            {
                if (err)
                {
                    res.send(500, 'Error changing password');
                    return;
                }

                res.send(200, 'Password successfully changed')

            });

        });
    });
}

exports.editUserPictureRequest = function(req, res)
{
    var sessionID = req.cookies.token;

    if (util.isNullOrUndefined(sessionID))
    {
        res.send(400, 'invalid session');
        return;
    }

    if (util.isNullOrUndefined(req.files))
    {
        res.send(400);
        return;
    }

    if (util.isNullOrUndefined(req.files.file))
    {
        res.send(400);
        return;
    }

    var file = req.files.file;

    var fileInputResult = validateProfilePictureFile(file);

    if (!fileInputResult.valid)
    {
        res.send(400, fileInputResult.message);
        fileBusiness.deleteTempFile(file);
        return;
    }

    //get user id from session
    sessionPersistence.getSession(sessionID, function(err, result)
    {
        if(util.isNullOrUndefined(result))
        {
            res.send(400, 'Session error: unknown session');
            fileBusiness.deleteTempFile(file);
            return;
        }

        var userID = result.user_id;

        if (!userID)
        {
            res.send(400, 'Session error: no related user id');
            fileBusiness.deleteTempFile(file);
            return;
        }

        userPersistence.getUserDataByID(userID, function(err, user)
        {
            if (err)
            {
                console.log(err);
                fileBusiness.deleteTempFile(file);
                res.send(500, 'error');
                return;
            }

            if(util.isNullOrUndefined(user))
            {
                res.send(500, 'error getting user details');
                fileBusiness.deleteTempFile(file);
                return;
            }

            var splits = file.name.split(".");
            var fileExtension = splits[splits.length - 1];

            file.name = user.id + '.' + fileExtension;

            fileBusiness.storeUserProfilePicture(file, imageSavedHandler);

            function imageSavedHandler(err)
            {
                if (err)
                {
                    console.log(err);
                    fileBusiness.deleteTempFile(file);
                    res.send(500, 'error saving picture');
                    return;
                }

                var filePath = PATH_TO_CUSTOM_PROFILE_PICTURES + file.name;

                userPersistence.updateUserPicturePath(user.id, filePath, function(err)
                {
                    if (err)
                    {
                        console.log(err);
                        res.send(500, 'error saving picture');
                        return;
                    }

                    res.send(200, filePath)
                });
            }
        });
    });

}

exports.deleteUserPictureRequest = function(req, res)
{
    var sessionID = req.cookies.token;

    if (util.isNullOrUndefined(sessionID))
    {
        res.send(400, 'invalid session');
        return;
    }

    //get user id from session
    sessionPersistence.getSession(sessionID, function(err, result)
    {
        if(util.isNullOrUndefined(result))
        {
            res.send(400, 'Session error: unknown session');
            return;
        }

        var userID = result.user_id;

        if (!userID)
        {
            res.send(400, 'Session error: no related user id');
            return;
        }

        userPersistence.getUserDataByID(userID, function(err, user)
        {
            if (err)
            {
                console.log(err);
                res.send(500, 'error');
                return;
            }

            if(util.isNullOrUndefined(user))
            {
                res.send(500, 'error getting user details');
                return;
            }

            userPersistence.updateUserPicturePath(user.id, DEFAULT_PROFILE_PICTURE, userPicturePathUpdatedHandler);


            function userPicturePathUpdatedHandler(err)
            {
                if (err)
                {
                    console.log(err);
                    res.send(500, 'error saving picture');
                    return;
                }

                res.send(200, DEFAULT_PROFILE_PICTURE);
            }
        });
    });

}

exports.resetForgottenPasswordRequest = function(req, res)
{
    var email = req.body.email;

    var emailInputResult = validateEmailInput(email);

    if (!emailInputResult.valid)
    {
        res.send(400, emailInputResult.message);
        return;
    }

    userPersistence.getUserDataByEmail(email, userDataReturnedHandler);

    function userDataReturnedHandler(err, user)
    {
        if (err)
        {
            console.log(err);
            res.send(500, 'error');
            return;
        }

        if (util.isNullOrUndefined(user))
        {
            res.send(400, 'Email supplied does not belong to a registered user');
            return;
        }

        var newPassword = (Math.random() + 1).toString(36).substring(2,8);

        var newHash = passwordHash.generate(newPassword, {algorithm: 'sha512'});

        userPersistence.updateUserPassword(user.id, newHash, function(err)
        {
            if (err)
            {
                res.send(500, 'Error resetting password');
                return;
            }

            emailBusiness.sendForgotPasswordEmail(email, newPassword, emailSentHandler)

        });

        function emailSentHandler(err)
        {
            if (err)
            {
                res.send(500, 'Error sending email with further instructions, please try again later');
                return;
            }

            res.send(200, 'An email has been sent to ' + email + ' with further instructions.')
        }
    }
}

exports.checkIfLoggedIn = function(sessionID, callback)
{
    sessionPersistence.getSession(sessionID, function(err, result)
    {
        if(!util.isNullOrUndefined(result))
        {
            if (result.user_id)
            {
                return callback(true);
            }
        }

        return callback(false);
    });
}

exports.getUserFromSessionIDRequest = function(req, res)
{
    var sessionID = req.cookies.token;

    if (typeof sessionID === 'undefined')
    {
        res.send(400, 'no token supplied');
        return;
    }

    sessionPersistence.getSession(sessionID, function(err, result)
    {
        if (util.isNullOrUndefined(result))
        {
            res.clearCookie('token', {path: '/'});
            res.send(400, 'invalid session');
            return;
        }

        if (!result.user_id)
        {
            res.clearCookie('token', {path: '/'});
            res.send(400, 'invalid session');
            return;
        }

        userPersistence.getUserDataByID(result.user_id, function(err, user)
        {
            if (err)
            {
                throw err;
            }

            if (util.isNullOrUndefined(user))
            {
                res.clearCookie('token', {path: '/'});
                res.send(400, 'invalid session');
                return;
            }

            var picture = getPictureOrDefaultPictureFromUser(user);

            var userData =
            {
                name: user.name,
                email: user.email,
                picture: picture
            }

            res.send(userData);
        });
    });
}

function validateUsernameInput(username)
{
    var result =
    {
        valid: true,
        message: ""
    }

    if (username == null || username == '')
    {
        result.message += 'Invalid username';
        result.valid = false;
    }

    if (!validator.isAlphanumeric(username))
    {
        result.message += 'Username can only contain alphanumeric characters';
        result.valid = false;
    }

    return result;
}

function validateEmailInput(email)
{
    var result =
    {
        valid: true,
        message: ""
    }

    if (email == null || email == '')
    {
        result.message += 'Email supplied was blank';
        result.valid = false;
        return result;
    }

    if (!validator.isEmail(email))
    {
        result.message += 'Invalid email';
        result.valid = false;
    }

    return result;
}

function validatePasswordInput(password)
{
    var result =
    {
        valid: true,
        message: ""
    }

    if (password == null || password == '')
    {
        result.message += 'Invalid password';
        result.valid = false;
    }

    if (!validator.isLength(password, 5, 25))
    {
        result.message += 'Password needs to be between 5 and 25 characters'
        result.valid = false;
    }


    return result;
}

function validateProfilePictureFile(file)
{
    var result =
    {
        valid: true,
        message: ""
    }

    if (util.isNullOrUndefined(file))
    {
        result.message += 'No image uploaded';
        result.valid = false;
        return result;
    }

    if (file.type.substring(0,6) !== 'image/')
    {
        result.message += 'Please select an image';
        result.valid = false;
        return result;
    }

    // 3mb in bytes
    if (file.size > 3145728)
    {
        result.message += 'Image too big, Please select an image smaller than 3mb';
        result.valid = false;
        return result;
    }

    return result;
}

function getPictureOrDefaultPictureFromUser(user)
{
    var result = "";

    if (util.isNullOrUndefined(user.picture))
    {
        result = DEFAULT_PROFILE_PICTURE;
    }
    else
    {
        result = user.picture;
    }

    return result;
}