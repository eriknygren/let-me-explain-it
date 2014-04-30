angularApp.controller('ToolbarController', ['$scope', '$dialog', '$window', 'socketIOService', 'angularBroadcastService',
    function($scope, $dialog, $window, socketIOService, angularBroadcastService)
    {
        $scope.remoteUsers = [];

        $scope.isFollowing = false;
        $scope.activeTab = "Drawing Board";
        $scope.brushColor = "#4bf";

        var inviteFriendsBody = "Copy the link below and send it to your attendees";
        var inviteFriendsURL = $window.location.href;

        var resizeDialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: false,
            templateUrl: '../modals/resizeWorkAreaDialog',
            controller: 'ResizeWorkAreaDialogController'
        };

        var resetDrawingBoardDialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl:  '../modals/yesNo',
            controller: 'YesNoModalController',
            resolve: {
                title: function()
                {
                    return 'Confirm Reset Drawing Board';
                },
                content: function()
                {
                    return 'This will reset the drawing board to blank, continue?';
                }
            }
        };

        var inviteFriendsDialogOptions = {
            backdrop: false,
            keyboard: true,
            backdropClick: true,
            templateUrl:  '../modals/info',
            controller: 'InfoModalController',
            resolve: {
                title: function()
                {
                    return 'Invite Friends';
                },
                content: function()
                {
                    return inviteFriendsBody;
                },
                easyCopyContent: function()
                {
                    return inviteFriendsURL
                }
            }
        };

        $scope.$on('tab:change', function(event, args)
        {
            $scope.activeTab = args;
        });

        $scope.onInviteFriendsClicked = function()
        {
            var inviteFriendsDialog = $dialog.dialog(inviteFriendsDialogOptions);
            inviteFriendsDialog.open();
        }

        $scope.onResizeClicked = function()
        {
            var resizeDialog = $dialog.dialog(resizeDialogOptions);
            resizeDialog.open().then(function(result)
            {
                if (result)
                {
                    angularBroadcastService.broadCast('requestWorkAreaResize', result);
                }
            });
        }

        $scope.onResetClicked = function()
        {
            var resetDrawingBoardDialog = $dialog.dialog(resetDrawingBoardDialogOptions);
            resetDrawingBoardDialog.open().then(function(result)
            {
                if (result)
                {
                    socketIOService.emit('canvas:reset', null);
                }
            });
        }

        $scope.followUser = function(userID)
        {
            $scope.isFollowing = true;
            updateMapFollowingStatus(true, userID);
        }

        $scope.$watch('isFollowing', function(newValue)
        {
            if (!newValue)
            {
               updateMapFollowingStatus(false, null);
            }
        });

        $scope.$watch('brushColor', function(newValue)
        {
            angularBroadcastService.broadCast('canvas:brushColor', newValue);
        });

        $scope.$on('remoteUsers:update', function(event, args)
        {
            $scope.remoteUsers = args;
        });

        function updateMapFollowingStatus(following, userID)
        {
            var args = {};
            args.isFollowing = following;
            args.followUser = userID;
            angularBroadcastService.broadCast('map:following', args);
        }
    }]);


