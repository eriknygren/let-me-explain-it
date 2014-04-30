angularApp.controller(
    'TabController', ['$scope', 'angularBroadcastService', 'socketIOService',
        function($scope, angularBroadcastService, socketIOService)
        {
            $scope.tabSelected = function(tabName)
            {
                var data =
                {
                    socketID: socketIOService.getSocketID(),
                    newValue: tabName
                }

                angularBroadcastService.broadCast('tab:change', tabName);
                socketIOService.emit('tab:change', data);
            };

        }]);