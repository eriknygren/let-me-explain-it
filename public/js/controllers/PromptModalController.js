angularApp.controller('PromptModalController', ['$scope', 'dialog', 'title', 'inputText', 'showDeleteButton',
    function($scope, dialog, title, inputText, showDeleteButton)
    {
        var result =
        {
            delete: false,
            message: ""
        };

        $scope.showDeleteButton = showDeleteButton;
        $scope.title = title;
        $scope.inputText = inputText;

        $scope.save = function()
        {
            result.message = $scope.inputText;
            dialog.close(result);
        };

        $scope.delete = function()
        {
            result.delete = true;
            dialog.close(result);
        };

        $scope.cancel = function()
        {
            dialog.close();
        }
    }]);
