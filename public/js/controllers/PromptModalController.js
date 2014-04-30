angularApp.controller('PromptModalController', ['$scope', 'dialog', 'title', 'inputText',
    function($scope, dialog, title, inputText)
    {
        $scope.title = title
        $scope.inputText = inputText;

        $scope.save = function()
        {
            dialog.close($scope.inputText);
        }

        $scope.cancel = function()
        {
            dialog.close();
        }
    }]);
