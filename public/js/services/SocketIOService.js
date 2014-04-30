angularApp.factory('socketIOService', function($rootScope, safeApplyService, $location, $window)
{
    var SOCKET_CONNECT_ADDRESS = $window.location.origin;
    var clientSocketService = {};

    $rootScope.$broadcast('socket:connecting', null);
    console.log('Connecting socket');
    var socket = io.connect(SOCKET_CONNECT_ADDRESS);

    $rootScope.$on('socket:connect', function(event, args)
    {
       if (typeof socket !== 'undefined' && !socket.socket.connected)
       {
           $rootScope.$broadcast('socket:connecting', null);
           console.log('Reconnecting socket');
           socket.socket.connect();
       }
    });

    $rootScope.$on('socket:disconnect', function(event, args)
    {
        if (typeof socket !== 'undefined' && socket.socket.connected)
        {
            console.log('Disconnecting socket');
            socket.disconnect();

            if ($location.path() !== '/')
            {
                safeApplyService.apply($rootScope, function()
                {
                    $location.path('/');
                });
            }
        }
    });

    socket.on('connect', function()
    {
        console.log('Socket is connected');
        $rootScope.$broadcast('socket:connected', null);
    });

    socket.socket.on('error', function (reason)
    {
        console.log(reason);

        if (reason === 'handshake error')
        {
            console.log('Socket connection rejected.');
        }

        safeApplyService.apply($rootScope, function()
        {
            $location.path('/');
        });
    });

    clientSocketService.on = function(eventName, callback)
    {
        socket.on(eventName, function()
        {
            var args = arguments;
            safeApplyService.apply($rootScope, function()
            {
                callback.apply(socket, args);
            });
        });
    };

    clientSocketService.emit = function(eventName, data, callback)
    {
        socket.emit(eventName, data, function()
        {
            var args = arguments;
            safeApplyService.apply($rootScope, function()
            {
                if (callback)
                {
                    callback.apply(socket, args);
                }
            });
        });
    };

    clientSocketService.removeAllListeners = function(event)
    {
        socket.removeAllListeners(event);
    }

    clientSocketService.removeListener = function(event, eventHandler)
    {
        socket.removeListener(event, eventHandler);
    }

    clientSocketService.getSocketID = function()
    {
        return socket.socket.sessionid;
    }

    clientSocketService.isConnected = function()
    {
        return socket.socket.connected;
    }

    return clientSocketService;
});