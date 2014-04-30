describe('TabController spec', function()
{
    var scope;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller)
    {
        scope = $rootScope.$new();

        $controller('TabController', { $scope: scope, socketIOService: mockSocketIOService });

    }));

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('expects rootScope event to be broadcasted on tab change', function()
    {

        scope.tabSelected('newTab');

        scope.$on('tab:change', function(event, args)
        {
            expect(args).toBe('newTab');
        });
    });

    it("socket.io event to be emitted on tab change", function() {
        spyOn(mockSocketIOService, 'emit');

        var expectedData =
        {
            socketID: mockSocketIOService.getSocketID(),
            newValue: 'newTab'
        };

        scope.tabSelected('newTab');

        expect(mockSocketIOService.emit).toHaveBeenCalledWith('tab:change', expectedData);
    });

});