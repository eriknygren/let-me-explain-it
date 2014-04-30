describe('MainRoomController spec', function()
{
    var scope;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller)
    {
        scope = $rootScope.$new();

        $controller('MainRoomController', {
            $scope: scope,
            socketIOService: mockSocketIOService,
            clientStatusService: mockClientStatusService });
    }));

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('hides the loading screen when told by the server that the room is ready', function()
    {
        mockSocketIOService.emit('room:ready', {});

        expect(scope.isLoaded).toBe(true);
    });

    it('expects rootScope event to be broadcasted on receiving status update from server', function()
    {
        spyOn(mockClientStatusService, 'broadCastRoomStatusUpdate');

        mockSocketIOService.emit('room:statusUpdate', {});

        expect(mockClientStatusService.broadCastRoomStatusUpdate).toHaveBeenCalled();
    });

    it('should get the room status when receiving request from server', function()
    {
        spyOn(mockClientStatusService, 'getRoomStatus');

        mockSocketIOService.emit('room:statusRequest', {});

        expect(mockClientStatusService.getRoomStatus).toHaveBeenCalled();
    });

});