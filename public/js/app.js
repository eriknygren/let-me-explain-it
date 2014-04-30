var angularApp = angular.module('angularApp', ['ui.bootstrap', 'colorpicker.module', 'angularFileUpload']);

/*app.config(['$routeProvider', function($routeProvider) {
    ...
}]);*/

angularApp.config(['$routeProvider', '$locationProvider',
    function( $routeProvider, $locationProvider )
    {

        $locationProvider.html5Mode(true);

        $routeProvider.when('/', { templateUrl: '/partials/login'});
        $routeProvider.when('/room/:roomName', { templateUrl: '/partials/room'});
        $routeProvider.when('/notSupported', { templateUrl: '/partials/notSupported'});
        $routeProvider.otherwise({ redirectTo: '/' });
        //$routeProvider.otherwise({ templateUrl: '/partials/login' });

    }]).run(['$rootScope', '$location', function($rootScope, $location) {

        // register listener to watch route changes
        $rootScope.$on("$routeChangeStart", function(event, next, current)
        {
            if (!isBrowserCompatible())
            {
                $location.path('/notSupported');
                return;
            }

            if (next.templateUrl === '/partials/room')
            {
                $rootScope.$broadcast('title:show', null);
                $rootScope.$broadcast('socket:connect', null);
            }
            else if(next.templateUrl !== '/partials/room')
            {
                $rootScope.$broadcast('title:hide', null);
                $rootScope.$broadcast('socket:disconnect', null);
            }
        });
    }]);


function isBrowserCompatible()
{
    if (typeof document.createElement("canvas").getContext != 'function')
    {
        return false;
    }

    if (typeof(WebSocket) != "function" )
    {
        return false;
    }

    return true;
};

