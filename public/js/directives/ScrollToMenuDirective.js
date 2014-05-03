angularApp.directive('scrolltomenudirective', function()
{
    return {
        restrict: "A",
        link: function(scope, element)
        {
            angular.element(element).bind('click', function()
            {
                scrollToMenu();
            });

            function scrollToMenu()
            {
                $("#center-pane").scrollTop(0);
            }
        }
    };
});