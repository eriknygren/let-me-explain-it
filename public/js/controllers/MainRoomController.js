angularApp.controller('MainRoomController', ['$scope', 'socketIOService', 'safeApplyService', 'clientStatusService',
    function($scope, socketIOService, safeApplyService, clientStatusService)
    {
        $scope.isLoaded = false;
        clientStatusService.checkLoginStatus();

        socketIOService.on('room:ready', function(data)
        {
            $scope.isLoaded = true;
        });

        socketIOService.on('room:statusRequest', function(callback)
        {
            clientStatusService.getRoomStatus(function(data)
            {
                return callback(data);
            });
        });

        socketIOService.on('room:statusUpdate', function(data)
        {
            clientStatusService.broadCastRoomStatusUpdate(data);
        });

        $scope.$on("$destroy", function()
        {
            socketIOService.removeAllListeners('room:statusRequest');
            socketIOService.removeAllListeners('room:statusUpdate');
            socketIOService.removeAllListeners('client:sessionID');
        })
    }])
