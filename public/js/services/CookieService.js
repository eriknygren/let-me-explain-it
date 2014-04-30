angularApp.factory('cookieService', function()
{
    var cookieService = {};

    cookieService.readCookie = function(name)
    {
        return $.cookie(name);
    };

    cookieService.deleteCookie = function(name, path)
    {
        return $.removeCookie(name,{ path: path });
    };

    cookieService.writeCookie = function(name, value, path)
    {
        $.cookie(name, value, { path: path });
    };

    return cookieService;
});