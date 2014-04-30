angularApp.controller('UserSettingsController', ['$scope', '$upload', '$http','dialog', 'clientStatusService',
    function($scope, $upload, $http, dialog, clientStatusService)
    {
        $scope.DEFAULT_VIEW = "0";
        $scope.PASSWORD_VIEW = "1";
        $scope.PICTURE_VIEW = "2";

        $scope.CURRENT_VIEW = $scope.DEFAULT_VIEW;
        $scope.showErrorText = false;
        $scope.showSuccessText = false;
        $scope.showUploadProgressText = false;
        $scope.uploadProgress = 0;

        var userData = clientStatusService.getUserData();

        $scope.isLoggedIn = userData.isLoggedIn;
        $scope.username = userData.username;
        $scope.email = userData.email;
        $scope.picture = userData.picture;

        $scope.canClickChangeDetails = true;
        $scope.canClickChangePassword = true;
        $scope.canClickEditPicture = true;

        var image;

        $scope.changeView = function(viewName)
        {
            $scope.showErrorText = false;
            $scope.showSuccessText = false;
            $scope.CURRENT_VIEW = viewName;
        }

        $scope.editUserSettings = function()
        {
            $scope.canClickChangeDetails = false;
            if (!$scope.email || $scope.email === '' ||
                !$scope.username || $scope.username === '')
            {
                showErrorText('Please fill in all fields');
                return;
            }

            var data =
            {
                username: $scope.username,
                email: $scope.email
            }

            $http({method: 'POST', url: '/api/editUserDetails', data: data}).
                success(function(data, status, headers, config) {
                    $scope.canClickChangeDetails = true;
                    console.log(data);
                    clientStatusService.setUserData(data.name, data.email, null, true);

                    $scope.username = data.name;
                    $scope.email = data.email;

                    showSuccessText('Details successfully altered')

                }).
                error(function(data, status, headers, config) {
                    $scope.canClickChangeDetails = true;
                    showErrorText(data);

                });
        };

        $scope.editUserPassword = function()
        {
            $scope.canClickChangePassword = false;
            if (!$scope.oldPassword || $scope.oldPassword === '' ||
                    !$scope.password || $scope.password === '' ||
                    !$scope.password2 || $scope.password2 === '')
            {
                showErrorText('Please fill in all fields');
                return;
            }

            if ($scope.password !== $scope.password2)
            {
                showErrorText('New passwords do not match');
                return;
            }

            var data =
            {
                oldPassword: $scope.oldPassword,
                password: $scope.password,
                password2: $scope.password2
            }

            $http({method: 'POST', url: '/api/editUserPassword', data: data}).
                success(function(data, status, headers, config)
                {
                    $scope.canClickChangePassword = true;
                    showSuccessText(data);
                    clearChangePasswordFields();
                }).
                error(function(data, status, headers, config)
                {
                    $scope.canClickChangePassword = true;
                    showErrorText(data);
                });
        }

        $scope.deleteUserPicture = function()
        {
            $scope.canClickEditPicture = false;

            $http({method: 'POST', url: '/api/deleteUserPicture'}).
                success(function(data, status, headers, config) {
                    $scope.canClickEditPicture = true;
                    $scope.picture = data;
                    showSuccessText('Picture successfully removed');

                }).
                error(function(data, status, headers, config) {
                    $scope.canClickEditPicture = true;
                    showErrorText(data);
                });
        }

        $scope.editUserPicture = function()
        {
            var NON_IMAGE_ERROR_TEXT = "Please select an image";

            $scope.canClickEditPicture = false;

            if (typeof image === 'undefined')
            {
                $scope.canClickEditPicture = true;
                showErrorText(NON_IMAGE_ERROR_TEXT);
                return;
            }

            if (!image)
            {
                $scope.canClickEditPicture = true;
                showErrorText(NON_IMAGE_ERROR_TEXT);
                return;
            }

            if (typeof image.type === 'undefined')
            {
                $scope.canClickEditPicture = true;
                showErrorText(NON_IMAGE_ERROR_TEXT);
                return;
            }

            if (image.type.substring(0,6) !== 'image/')
            {
                $scope.canClickEditPicture = true;
                showErrorText(NON_IMAGE_ERROR_TEXT);
                return;
            }

            if (image.size > 3145728)
            {
                $scope.canClickEditPicture = true;
                showErrorText('Image needs to be smaller than 3mb');
                return;
            }

            $scope.showUploadProgressText = true;

            $scope.upload = $upload.upload({
                url: '/api/editUserPicture',
                method: 'POST',
            file: image
            }).progress(function(evt) {

                    $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);

                }).success(function(data, status, headers, config) {
                    $scope.canClickEditPicture = true;
                    $scope.showUploadProgressText = false;

                    // Just so the src is refreshed we make the GET url unique with a datestamp
                    $scope.picture = data + "#" + new Date().getTime();

                    showSuccessText('Picture successfully changed');
                }).error(function (data, status, headers, config) {

                    $scope.canClickEditPicture = true;
                    $scope.showUploadProgressText = false;
                    showErrorText(data);
                })
        }

        $scope.onUploadFileChanged = function(files)
        {
            // thanks http://stackoverflow.com/a/17504984
            image = files[0];
        };

        $scope.onCloseClicked = function()
        {
            dialog.close();
        }

        function clearChangePasswordFields()
        {
            $scope.oldPassword = "";
            $scope.password = "";
            $scope.password2 = "";
        }

        function showSuccessText(text)
        {
            $scope.successText = text;
            $scope.showSuccessText = true;
            $scope.showErrorText = false;
        }

        function showErrorText(text)
        {
            $scope.errorText = text;
            $scope.showErrorText = true;
            $scope.showSuccessText = false;
        }
    }]);
