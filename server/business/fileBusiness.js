var fs = require("fs");
var path = require('path');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });

exports.storeUserProfilePicture = function(image, callback)
{
    var tempPath = image.path;
    var targetPath = path.resolve('../public/images/avatars/' + image.name);

    imageMagick(tempPath)
        .resize(99, 99, "!")
        .write(targetPath, function (err)
        {
            if (err)
            {
                console.log("Error resizing file, is ImageMagick installed?");
                return callback(err);
            }

            console.log("File " + image.name + " saved");

            fs.unlink(tempPath, function(err)
            {
                if(err)
                {
                    console.log("Couldn't delete temp file");
                    console.log(err);
                }
            });

            return callback(null);
        });
}

exports.deleteTempFile = function(file)
{
    var tempPath = file.path;

    fs.unlink(tempPath, function(err)
    {
        if(err)
        {
            console.log("Couldn't delete temp file");
            console.log(err);
        }
    });
}