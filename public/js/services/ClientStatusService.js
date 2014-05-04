angularApp.factory('clientStatusService', function(angularBroadcastService, $rootScope, cookieService, $window, $http)
{
    var RIGHT_PANE_WIDTH = 225;
    var LEFT_PANE_WIDTH = 225;
    var WORKSPACE_WIDTH_PADDING = 150;
    var WORKSPACE_HEIGHT_PADDING = 100;
    var HEADER_BAR_HEIGHT = 25;
    var FOOTER_BAR_HEIGHT = 25;
    var CHAT_INPUT_CONTROLS_HEIGHT = 22;
    var CHAT_MESSAGES_CONTAINER_PADDING = 4;
    var LOCAL_USER_CONTAINER_HEIGHT = 100;
    var DEFAULT_CANVAS_WIDTH = 510;
    var DEFAULT_CANVAS_HEIGHT = 510;
    var RESPONSIVE_NAV_BAR_HEIGHT = 30;

    var clientStatusService = {};

    var localUser =
    {
        username: "",
        email: "",
        isLoggedIn: false,
        picture: ""
    }

    clientStatusService.checkLoginStatus = function()
    {
        var token = cookieService.readCookie('token');
        if (typeof token !== 'undefined')
        {
            var data =
            {
                token: token
            }

            $http({method: 'POST', url: '/api/getUser', data: data}).
                success(function(data, status, headers, config) {

                    localUser.username = data.name;
                    localUser.email = data.email;
                    localUser.picture = data.picture;
                    localUser.isLoggedIn = true;
                    angularBroadcastService.broadCast('localUser:logInStatusUpdate', localUser);
                }).
                error(function(data, status, headers, config) {

                    console.log(data);
                    localUser.username = "";
                    localUser.email = "";
                    localUser.isLoggedIn = false;
                    angularBroadcastService.broadCast('localUser:logInStatusUpdate', localUser);
                });
        }
        else
        {
            localUser.isLoggedIn = false;
            angularBroadcastService.broadCast('localUser:logInStatusUpdate', localUser);
        }
    }

    clientStatusService.getRoomStatus = function(callback)
    {
        angularBroadcastService.broadCast('canvas:statusRequest', function(canvasResults)
        {
            angularBroadcastService.broadCast('map:statusRequest', function(mapResults)
            {
                return callback(
                    {
                        canvas: canvasResults,
                        map: mapResults
                    });
            });
        });
    }

    clientStatusService.broadCastRoomStatusUpdate = function(data)
    {
        angularBroadcastService.broadCast('canvas:statusUpdate', data.canvas);
        angularBroadcastService.broadCast('map:statusUpdate', data.map);
    }

    clientStatusService.getOptimalCanvasSize = function()
    {
        var result =
        {
            width: $window.innerWidth - getCanvasWidthOffset(),
            height: $window.innerHeight - getCanvasHeightOffset()
        };

        return result;
    };

    clientStatusService.getDefaultCanvasSize = function()
    {
        var result =
        {
            width: DEFAULT_CANVAS_WIDTH,
            height: DEFAULT_CANVAS_HEIGHT
        };

        return result;
    };

    clientStatusService.getMarginsForChat = function()
    {
        var chatMargins = HEADER_BAR_HEIGHT;
        chatMargins = chatMargins + FOOTER_BAR_HEIGHT;
        chatMargins = chatMargins + CHAT_INPUT_CONTROLS_HEIGHT;
        chatMargins = chatMargins + CHAT_MESSAGES_CONTAINER_PADDING;

        if (!is_x0_y0_CSS())
        {
            chatMargins = chatMargins + LOCAL_USER_CONTAINER_HEIGHT;
        }

        if (!is_x960_CSS())
        {
            chatMargins = chatMargins + RESPONSIVE_NAV_BAR_HEIGHT;
        }

        return chatMargins;
    };

    clientStatusService.is_x960_CSS = function()
    {
        return is_x960_CSS();
    };

    clientStatusService.is_x760_CSS = function()
    {
        return is_x760_CSS();
    };

    clientStatusService.is_x520_y440_CSS = function()
    {
        return is_x520_y440_CSS();
    };

    clientStatusService.is_x0_y0_CSS = function()
    {
        return is_x0_y0_CSS();
    };

    $rootScope.$on('localUser:update', function(event, args)
    {
        localUser.username = args.username;
    });

    clientStatusService.setUserData = function(newUsername, newEmail, newPicture, newLoggedInStatus)
    {
        localUser.username = newUsername;
        localUser.email = newEmail;

        if (newPicture)
        {
            localUser.picture = newPicture;
        }

        localUser.isLoggedIn = newLoggedInStatus;
    };

    clientStatusService.getUserData = function()
    {
        return localUser;
    };

    function getCanvasWidthOffset()
    {

        if (is_x0_y0_CSS())
        {
            return 20;
        }

        if (is_x520_y440_CSS())
        {
            return 20;
        }

        if (is_x760_CSS())
        {
            return RIGHT_PANE_WIDTH + WORKSPACE_WIDTH_PADDING;
        }

        if (is_x960_CSS())
        {
            return RIGHT_PANE_WIDTH + LEFT_PANE_WIDTH + WORKSPACE_WIDTH_PADDING;
        }

    }

    function getCanvasHeightOffset()
    {
        if (is_x760_CSS() || is_x960_CSS())
        {
            return HEADER_BAR_HEIGHT + FOOTER_BAR_HEIGHT + WORKSPACE_HEIGHT_PADDING;
        }
        else
        {
            return HEADER_BAR_HEIGHT + FOOTER_BAR_HEIGHT + WORKSPACE_HEIGHT_PADDING + RESPONSIVE_NAV_BAR_HEIGHT;
        }


    }

    function is_x0_y0_CSS()
    {
        if($window.innerWidth < 520 ||
            ($window.innerWidth < 760 && $window.innerHeight < 440))
        {
            return true;
        }

        return false;
    }

    function is_x520_y440_CSS()
    {
        if ($window.innerWidth < 760 && $window.innerWidth >= 520
            && $window.innerHeight >= 440)
        {
            return true;
        }

        return false;
    }

    function is_x760_CSS()
    {
        if ($window.innerWidth < 960 && $window.innerWidth >= 760)
        {
            return true;
        }

        return false;
    }

    function is_x960_CSS()
    {
        if ($window.innerWidth >= 960)
        {
            return true;
        }

        return false;
    }

    return clientStatusService;
});