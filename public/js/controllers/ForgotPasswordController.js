angularApp.controller('ForgotPasswordController', ['$scope', '$http','dialog', 'clientStatusService',
    function($scope, $http, dialog, clientStatusService)
    {
        $scope.showErrorText = false;
        $scope.showSuccessText = false;
        $scope.canClickResetPassword = true;

        $scope.resetPassword = function()
        {
            $scope.canClickResetPassword = false;
            if (!$scope.email || $scope.email === '')
            {
                showErrorText('Please fill in all fields');
                return;
            }

            var args =
            {
                email: $scope.email
            }

            $http({method: 'POST', url: '/api/resetUserPassword', data: args}).
                success(function(data, status, headers, config) {
                    $scope.canClickResetPassword = true;
                    showSuccessText(data)
                }).
                error(function(data, status, headers, config) {
                    $scope.canClickResetPassword = true;
                    showErrorText(data);
                });
        };

        $scope.onCloseClicked = function()
        {
            dialog.close();
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
