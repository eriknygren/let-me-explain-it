angularApp.directive('colorpickericondirective', function(angularBroadcastService)
{
    return {
        restrict: "A",
        link: function(scope, element, attrs)
        {
            scope.$watch(attrs.model, function(newValue)
            {
                element.css('background-color', newValue);
            });
        }
    };
});