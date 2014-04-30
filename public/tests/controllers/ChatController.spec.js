describe('ChatController spec', function()
{
    var scope;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller)
    {
        scope = $rootScope.$new();

        $controller('ChatController', { $scope: scope, socketIOService: mockSocketIOService });

    }));

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('socket.io event to be emitted on new chat message', function()
    {
        spyOn(mockSocketIOService, 'emit');
        scope.chatMessage = "test message";

        var expectedData =
        {
            user: 'Mr Client',
            message: scope.chatMessage
        };

        scope.sendMessage();

        expect(mockSocketIOService.emit).toHaveBeenCalledWith('chat:message', expectedData);
    });

    // Needs to broadcast a rootscope event in order for the chat directive to push the message
    // out to the UI
    it("broadcasts a rootScope event on receiving a message on the socket", function()
    {
        scope.$on('chat:message', function(event, args)
        {
            expect(args.message).toMatch('socket message');
        });

        mockSocketIOService.emit("chat:message", { message: "socket message" });
    });

});