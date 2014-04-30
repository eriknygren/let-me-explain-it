angularApp.controller(
    'LocalUserController', ['$scope', 'angularBroadcastService', 'webRTCService', 'socketIOService', '$dialog', 'clientStatusService',
        function($scope, angularBroadcastService, webRTCService, socketIOService, $dialog, clientStatusService)
        {
            $scope.isVoiceChatEnabled = false;
            $scope.isWebRTCSupported = webRTCService !== null;
            $scope.username = "";
            $scope.picture = "";

            var UserSettingsOptions = {
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: '../modals/userSettings',
                controller: 'UserSettingsController'
            };

            $scope.showLocalUserOptions = function()
            {
                var userSettingsDialog = $dialog.dialog(UserSettingsOptions);
                userSettingsDialog.open().then(function()
                {
                    // username might have changed
                    var newUserData = clientStatusService.getUserData();

                    // TODO: if username has changed, let the rest of the room know
                    $scope.username = newUserData.username;
                });
            }

            if (!$scope.isWebRTCSupported)
            {
                return;
            }

            var voiceChatStatusListener = $scope.$watch('isVoiceChatEnabled', function(newValue)
            {
                angularBroadcastService.broadCast('rtc:enabledStatusChange', $scope.isVoiceChatEnabled);

                var data =
                {
                    socketID: socketIOService.getSocketID(),
                    rtcID: webRTCService.getID()
                }

                if (newValue)
                {

                    socketIOService.emit('rtc:enabled', data)
                }
                else
                {
                    socketIOService.emit('rtc:disabled', data)
                }
            });

            var userUpdateListener = $scope.$on('localUser:update', function(event, args)
            {
                $scope.username = args.username;
                $scope.picture = args.picture;
            });

            $scope.$on("$destroy", function()
            {
                userUpdateListener();
                voiceChatStatusListener();
            });

        }]);