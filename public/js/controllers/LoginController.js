angularApp.controller(
    'LoginController', ['$scope', '$dialog', '$http', '$location', 'clientStatusService', 'cookieService',
        function($scope, $dialog, $http, $location, clientStatusService, cookieService)
        {
            $scope.isLoaded = false;

            $scope.isLoggedIn = false;

            $scope.isCollapsed = true;
            $scope.isRegistrationInfoTextCollapsed = true;

            $scope.rememberUser = false;

            $scope.user = {};

            $scope.collapseLoginForm = true;

            $scope.roomJoinOptions = 'join';

            $scope.registrationErrorText = "";
            $scope.roomJoinErrorText = "";

            $scope.showRegistrationErrorText = false;
            $scope.showroomJoinErrorText = false;
            $scope.showLoginErrorText = false;

            $scope.canClickJoin = true;
            $scope.canClickRegister = true;
            $scope.canClickLogin = true;
            $scope.canClickLogout = true;
            $scope.canClickForgotPassword = true;


            var UserSettingsOptions = {
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: '../modals/userSettings',
                controller: 'UserSettingsController'
            };

            var forgotPasswordOptions = {
                backdrop: false,
                keyboard: true,
                backdropClick: true,
                templateUrl:  '../modals/forgotPassword',
                controller: 'ForgotPasswordController'
            };

            checkLoginStatus();

            function checkLoginStatus()
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

                            clientStatusService.setUserData(data.name, data.email, data.picture, true);

                            $scope.user =
                            {
                                username: data.name,
                                email: data.email
                            }

                            $scope.isLoggedIn = true;
                            $scope.isLoaded = true;

                        }).
                        error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.log(data);
                            $scope.isLoaded = true;
                        });
                }
                else
                {

                    $scope.isLoaded = true;
                }
            }

            $scope.onUserSettingsClicked = function()
            {
                var userSettingsDialog = $dialog.dialog(UserSettingsOptions);
                userSettingsDialog.open().then(function(result)
                {
                    // username and email might have changed
                    var newUserData = clientStatusService.getUserData();

                    $scope.user =
                    {
                        username: newUserData.username,
                        email: newUserData.email
                    }
                });
            }

            $scope.onForgotPasswordClicked = function()
            {
                var forgotPasswordDialog = $dialog.dialog(forgotPasswordOptions);
                forgotPasswordDialog.open();
            }

            $scope.onLoginClicked = function()
            {
                if (!$scope.username || $scope.username === '' ||
                    !$scope.password || $scope.password === '')
                {
                    showLoginErrorText('Please fill in all fields');
                    return;
                }

                $scope.canClickLogin = false;

                var data =
                {
                    username: $scope.username,
                    password: $scope.password,
                    remember: $scope.rememberUser
                }

                $http({method: 'POST', url: '/api/login', data: data}).
                    success(function(data, status, headers, config)
                    {
                        $scope.canClickLogin = true;
                        clientStatusService.setUserData(data.name, data.email, data.picture, true);

                        $scope.user =
                        {
                            username: data.name,
                            email: data.email
                        }

                        $scope.showLoginErrorText = false;
                        $scope.isLoggedIn = true;

                    }).
                    error(function(data, status, headers, config) {
                        $scope.canClickLogin = true;
                        showLoginErrorText(data);
                    });
            }

            $scope.onLogoutClicked = function()
            {
                $scope.canClickLogout = false;

                $http({method: 'POST', url: '/api/logout'}).
                    success(function(data, status, headers, config) {
                        $scope.canClickLogout = true;
                        clientStatusService.setUserData("", "", "", false);
                        $scope.isLoggedIn = false;
                    }).
                    error(function(data, status, headers, config) {
                        $scope.canClickLogout = true;
                        console.log(data);
                    });
            }

            $scope.joinRoom = function()
            {
                var roomName = $scope.roomName;
                $scope.canClickJoin = false;
                var createNewRoom = ($scope.roomJoinOptions === 'create');

                var data =
                {
                    roomName: roomName,
                    createNewRoom: createNewRoom
                }

                $http({method: 'POST', url: '/api/joinRoom', data: data}).
                    success(function(data, status, headers, config)
                    {
                        $scope.canClickJoin = true;
                        $scope.showroomJoinErrorText = false;
                        $location.path('/room/'+roomName.toLowerCase());
                    }).
                    error(function(data, status, headers, config)
                    {
                        showRoomJoinErrorText(data);
                        $scope.canClickJoin = true;
                    });
            }

            $scope.registerUser = function()
            {
                var username = $scope.registerUsername;
                var email = $scope.registerEmail;
                var password = $scope.registerPassword;

                if (!email || email === '' ||
                    !username || username === '' ||
                    !password || password === '')
                {
                    showRegistrationFormErrorText('Please fill in all fields');
                    return;
                }

                $scope.canClickRegister = false;

                var data =
                {
                    username: username,
                    email: email,
                    password: password
                }

                $http({method: 'POST', url: '/api/registerUser', data: data}).
                    success(function(data, status, headers, config)
                    {
                        $scope.canClickRegister = true;
                        clientStatusService.setUserData(data.name, data.email, data.picture, true);

                        $scope.user =
                        {
                            username: data.name,
                            email: data.email
                        }

                        $scope.showRegistrationErrorText = false;
                        $scope.isLoggedIn = true;

                    }).
                    error(function(data, status, headers, config)
                    {
                        $scope.canClickRegister = true;
                        showRegistrationFormErrorText(data);
                    });

            }

            function showRegistrationFormErrorText(text)
            {
                $scope.registrationErrorText = text;
                $scope.registerPassword = "";
                $scope.showRegistrationErrorText = true;
            }

            function showRoomJoinErrorText(text)
            {
                $scope.roomJoinErrorText = text;
                $scope.showroomJoinErrorText = true;
            }

            function showLoginErrorText(text)
            {
                $scope.loginErrorText = text;
                $scope.showLoginErrorText = true;
            }
        }]);