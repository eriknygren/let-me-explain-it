/**
 * Created with JetBrains WebStorm.
 * User: Erik
 * Date: 2013-08-14
 * Time: 10:41
 * To change this template use File | Settings | File Templates.
 */
angularApp.controller(
    'RemoteUsersController', ['$scope', 'angularBroadcastService', 'socketIOService','safeApplyService',
        function($scope, angularBroadcastService, socketIOService, safeApplyService)
        {
            $scope.remoteUsers = [];
            $scope.isVoiceChatEnabled;

            socketIOService.on('remoteUsers:connected', function(data)
            {
                console.log('User connecting');
                updateUsers(data);

            });

            socketIOService.on('remoteUsers:disconnected', function(data)
            {
                console.log('User disconnecting');
                angularBroadcastService.broadCast('remoteUser:disconnect', data.disconnectUserID);
                updateUsers(data.users);
            });

            socketIOService.on('rtc:enabled', function(data)
            {
                updateVoiceChatStatus(data.socketID, true)
            });

            socketIOService.on('rtc:disabled', function(data)
            {
                updateVoiceChatStatus(data.socketID, false)
            });

            socketIOService.on('tab:change', function(data)
            {
                updateCurrentTab(data.socketID, data.newValue)
            });

            function updateCurrentTab(userID, newValue)
            {
                for (var i = 0; i < $scope.remoteUsers.length; i++)
                {
                    console.log($scope.remoteUsers[i]);

                    if($scope.remoteUsers[i].id === userID)
                    {
                        $scope.remoteUsers[i].currentTab = newValue;

                        safeApplyService.apply($scope, $scope.remoteUsers[i].isVoiceChatEnabled);
                        break;
                    }
                }
            }

            function updateVoiceChatStatus(userID, newValue)
            {
                for (var i = 0; i < $scope.remoteUsers.length; i++)
                {
                    console.log($scope.remoteUsers[i]);

                    if($scope.remoteUsers[i].id === userID)
                    {
                        $scope.remoteUsers[i].isVoiceChatEnabled = newValue;

                        safeApplyService.apply($scope, $scope.remoteUsers[i].isVoiceChatEnabled);
                        break;
                    }
                }
            }

            function updateUsers(data)
            {
                var localSocketID = socketIOService.getSocketID();

                var length = data.length;
                for (var i = 0; i < length; i++)
                {
                    if(data[i].id === localSocketID)
                    {
                        angularBroadcastService.broadCast('localUser:update', data[i]);

                        data.splice(i, 1);
                        break;
                    }
                }

                $scope.remoteUsers = data;

                safeApplyService.apply($scope, $scope.remoteUsers);

                angularBroadcastService.broadCast('remoteUsers:update', data);
            }

            $scope.onVolumeChange = function(id, volume)
            {
                var args =
                {
                    id: id,
                    volume: volume
                }

                angularBroadcastService.broadCast('rtc:volumeChange', args);
            }

            var rtcStatusChangeListener = $scope.$on('rtc:enabledStatusChange', function(event, newValue)
            {
                $scope.isVoiceChatEnabled = newValue;
                safeApplyService.apply($scope, $scope.isVoiceChatEnabled);
            });

            $scope.$on("$destroy", function()
            {
                rtcStatusChangeListener();
                socketIOService.removeAllListeners('rtc:enabled');
                socketIOService.removeAllListeners('rtc:disabled');
                socketIOService.removeAllListeners('remoteUsers:connected');
                socketIOService.removeAllListeners('remoteUsers:disconnected');
            })
        }]);