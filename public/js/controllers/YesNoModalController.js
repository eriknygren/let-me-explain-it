angularApp.controller('YesNoModalController', ['$scope', 'dialog', 'title', 'content',
    function($scope, dialog, title, content)
    {
        $scope.title = title
        $scope.content = content;

        $scope.confirm = function()
        {
            dialog.close(true);
        }

        $scope.cancel = function()
        {
            dialog.close(false);
        }
    }]);
