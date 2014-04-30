angularApp.controller('ChatController', ['$scope', 'socketIOService', 'safeApplyService', 'angularBroadcastService',
    function($scope, socketIOService, safeApplyService, angularBroadcastService)
    {
        $scope.messages = [];

        $scope.chatMessage = '';

        socketIOService.on('chat:message', function(data)
        {
            console.log('New message');
            angularBroadcastService.broadCast('chat:message', data);
        });

        $scope.sendMessage = function()
        {
            if (!$scope.chatMessage || $scope.chatMessage === '')
            {
                return;
            }

            var data = { user: 'Mr Client', message: $scope.chatMessage };

            socketIOService.emit('chat:message', data);
            $scope.chatMessage = '';
        };

        $scope.$on("$destroy", function()
        {
            socketIOService.removeAllListeners('chat:message');
        })
    }])
