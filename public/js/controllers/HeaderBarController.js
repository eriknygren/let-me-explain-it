angularApp.controller(
    'HeaderBarController', ['$scope', '$location',
        function($scope, $location)
        {
            $scope.title = "";

            $scope.$on('title:show', function(event, title)
            {
                var currentLocation = $location.path();
                console.log(currentLocation);
                var splits = currentLocation.split("/");
                $scope.title = splits[splits.length - 1];
            });

            $scope.$on('title:hide', function(event, title)
            {
                $scope.title = "";
            });

        }]);
