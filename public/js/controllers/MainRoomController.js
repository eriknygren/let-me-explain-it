angularApp.controller('MainRoomController', ['$scope', '$window', 'socketIOService', 'safeApplyService', 'clientStatusService',
    function($scope, $window, socketIOService, safeApplyService, clientStatusService)
    {
        $scope.isLoaded = false;
        $scope.currentView = 'all';
        $scope.singleViewMode = false;
        evaluateLayout();
        clientStatusService.checkLoginStatus();


        angular.element($window).bind('resize', function()
        {
            evaluateLayout();
        });

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

        function evaluateLayout()
        {
            if (clientStatusService.is_x960_CSS())
            {
                if ($scope.singleViewMode)
                {
                    safeApplyService.apply($scope, $scope.singleViewMode = false);
                }

                if ($scope.currentView !== 'all')
                {
                    safeApplyService.apply($scope, $scope.currentView = 'all');
                }

            }

            if (clientStatusService.is_x760_CSS())
            {
                if ($scope.singleViewMode)
                {
                    safeApplyService.apply($scope, $scope.singleViewMode = false);
                }

                if ($scope.currentView !== 'chat' && $scope.currentView !== 'users')
                {
                    safeApplyService.apply($scope, $scope.currentView = 'chat');

                }
            }

            if (clientStatusService.is_x520_y440_CSS())
            {
                if (!$scope.singleViewMode)
                {
                    safeApplyService.apply($scope, $scope.singleViewMode = true);
                }

                if ($scope.currentView !== 'collaborate' && $scope.currentView !== 'chat+users')
                {
                    safeApplyService.apply($scope, $scope.currentView = 'collaborate');
                }
            }

            if (clientStatusService.is_x0_y0_CSS())
            {
                if (!$scope.singleViewMode)
                {
                    safeApplyService.apply($scope, $scope.singleViewMode = true);
                }

                if ($scope.currentView !== 'collaborate' && $scope.currentView !== 'chat'
                    && $scope.currentView !== 'users')
                {
                    safeApplyService.apply($scope, $scope.currentView = 'collaborate');
                }
            }

        }

        $scope.$on("$destroy", function()
        {
            socketIOService.removeAllListeners('room:statusRequest');
            socketIOService.removeAllListeners('room:statusUpdate');
            socketIOService.removeAllListeners('client:sessionID');
        });
    }]);
