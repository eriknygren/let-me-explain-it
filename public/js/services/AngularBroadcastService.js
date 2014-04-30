angularApp.factory('angularBroadcastService', function($rootScope)
{
    var clientSideBroadcastService = {};

    clientSideBroadcastService.broadCast = function(eventName, data)
    {
        $rootScope.$broadcast(eventName, data);
    };

    return clientSideBroadcastService;
});

