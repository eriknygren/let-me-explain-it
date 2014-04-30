angularApp.controller('InfoModalController', ['$scope', 'dialog', 'title', 'content', 'easyCopyContent',
    function($scope, dialog, title, content, easyCopyContent)
    {
        $scope.title = title
        $scope.content = content;
        $scope.showEasyCopyContent = false;
        $scope.easyCopyContent = "";

        if (typeof easyCopyContent !== 'undefined')
        {
            if (easyCopyContent !== "")
            {
                $scope.easyCopyContent = easyCopyContent;
                $scope.showEasyCopyContent = true;
            }
        }

        $scope.close = function()
        {
            dialog.close();
        }
    }]);
