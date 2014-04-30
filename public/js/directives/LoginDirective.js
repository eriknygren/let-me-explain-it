angularApp.directive('logindirective', function($window)
{
    return {
        restrict: "A",
        link: function(scope, element)
        {
            var CONTAINER_SIZE = 400;
            var PARENT_DIV_SIZE = 600;
            positionLoginContainer();

            angular.element($window).bind('resize', function()
            {
                positionLoginContainer();
            });

            angular.element(element).bind('resize', function()
            {
                positionLoginContainer();
            });

            function positionLoginContainer()
            {
                var newMarginTop = 0;
                if ($window.innerHeight > PARENT_DIV_SIZE + 50)
                {
                    newMarginTop = ($window.innerHeight / 2) - (CONTAINER_SIZE / 2);
                }
                else
                {
                    newMarginTop = ((PARENT_DIV_SIZE + 50) / 2) - (CONTAINER_SIZE / 2);
                }

                element.css( 'margin-top' , newMarginTop);
            }
        }
    };
});