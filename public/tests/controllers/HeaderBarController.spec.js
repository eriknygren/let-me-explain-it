describe('HeaderBarController spec', function()
{
    var scope, location;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $location)
    {
        scope = $rootScope.$new();
        location = $location;

        $controller('HeaderBarController', { $scope: scope });

    }));

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('extracts and displays the room name from current url on "title:show" event', function()
    {
        location.path('http://www.testdomain.com/room/testroomname');

        scope.$broadcast('title:show', null);

        expect(scope.title).toBe('testroomname');
    });

    it('removes the title on the "title:hide" event', function()
    {
        scope.title = "test title";

        scope.$broadcast('title:hide', null);

        expect(scope.title).toBe('');
    });

});