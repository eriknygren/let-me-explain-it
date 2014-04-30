var userBusiness = require('./userBusiness')
var util = require('../helpers/util');
var config = require('../config');


exports.base = function(req, res)
{
    res.render('base', { appDebug: config.DEBUG, apiKey: config.GOOGLE_MAPS_API_KEY });
};

exports.partials = function(req, res)
{
    var filename = req.params.filename;

    if(!filename)
    {
        return;
    }

    if (filename === 'login')
    {
        var sessionID = req.cookies.token;

        if (typeof sessionID !== 'undefined')
        {
            userBusiness.checkIfLoggedIn(sessionID, function(result)
            {
                if (!result)
                {
                    // This user is not logged in, remove the cookie
                    // so we don't have to check it again
                    res.clearCookie('token', {path: '/'});
                }

                res.render("partials/" + filename, { title: 'LetMeExplain.It' });
            });

            return;
        }
    }

    res.render("partials/" + filename, { title: 'LetMeExplain.It' });
};

exports.modals = function(req, res)
{
    var filename = req.params.filename;

    if(!filename)
    {
        return;
    }

    res.render("modals/" + filename, { title: 'LetMeExplain.It' });
}