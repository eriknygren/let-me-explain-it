describe('RemoteUsersController spec', function()
{
    var scope, location;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $location)
    {
        scope = $rootScope.$new();
        location = $location;

        $controller('RemoteUsersController', {
            $scope: scope,
            socketIOService: mockSocketIOService
        });

        scope.remoteUsers = [
            {
                id: '1',
                currentTab: 'test tab',
                picture: {},
                username: 'remoteuser1',
                isVoiceChatEnabled: false
            },
            {
                id: '2',
                currentTab: 'test tab',
                picture: {},
                username: 'remoteuser2',
                isVoiceChatEnabled: true
            }

        ];

    }));

    afterEach(function () {
        scope.$destroy();
    });

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('updates and broadcasts the remoteUsers model on socket remoteUsers:connected event and removes local user', function()
    {
        expect(scope.remoteUsers.length).toBe(2);

        var dataFromServer = [
            {
                // local id from mock socket io service
                id: '12345',
                currentTab: 'test tab',
                picture: {},
                username: 'local user',
                isVoiceChatEnabled: false
            },
            {
                id: '1',
                currentTab: 'test tab',
                picture: {},
                username: 'remoteuser1',
                isVoiceChatEnabled: false
            }

        ];

        scope.$on('remoteUsers:update', function(event, args)
        {
            // Should now only be one user with the local user removed
            expect(args.length).toBe(1);
        });

        mockSocketIOService.emit('remoteUsers:connected', dataFromServer);

    });

    it('updates and broadcasts the remoteUsers model + disconnectUserID on socket remoteUsers:disconnected event and removes local user', function()
    {
        expect(scope.remoteUsers.length).toBe(2);


        var dataFromServer =
        {
            users:
                [
                    {
                        // local id from mock socket io service
                        id: '12345',
                        currentTab: 'test tab',
                        picture: {},
                        username: 'local user',
                        isVoiceChatEnabled: false
                    },
                    {
                        id: '1',
                        currentTab: 'test tab',
                        picture: {},
                        username: 'remoteuser1',
                        isVoiceChatEnabled: false
                    }

                ],
            disconnectUserID: '12'
        };

        scope.$on('remoteUser:disconnect', function(event, args)
        {
            expect(args).toBe(dataFromServer.disconnectUserID);
        });

        scope.$on('remoteUsers:update', function(event, args)
        {
            expect(scope.remoteUsers.length).toBe(1);
        });

        mockSocketIOService.emit('remoteUsers:disconnected', dataFromServer);

    });

    it('updates a remote clients voice chat status when receiving the socket.io rtc:enabled event', function()
    {

        // First user in the predefined remoteUsers has id 1 and voice chat disabled by default
        expect(scope.remoteUsers[0].isVoiceChatEnabled).toBe(false);

        // event from server saying id 1 enabled his voice chat
        mockSocketIOService.emit('rtc:enabled', {socketID: '1'});


        // should now be true
        expect(scope.remoteUsers[0].isVoiceChatEnabled).toBe(true);

    });

    it('updates a remote clients voice chat status when receiving the socket.io rtc:disabled event', function()
    {

        // First user in the predefined remoteUsers has id 2 and voice chat enabled by default
        expect(scope.remoteUsers[1].isVoiceChatEnabled).toBe(true);

        // event from server saying id 2 disabled his voice chat
        mockSocketIOService.emit('rtc:disabled', {socketID: '2'});


        // should now be false
        expect(scope.remoteUsers[0].isVoiceChatEnabled).toBe(false);

    });

    it('updates a remote clients current tab status when receiving the socket.io tab:change event', function()
    {

        // First user in the predefined remoteUsers has id 2 and voice chat enabled by default
        expect(scope.remoteUsers[0].currentTab).toBe('test tab');

        // event from server saying id 2 disabled his voice chat
        mockSocketIOService.emit('tab:change', {socketID: '1', newValue: 'new tab'});


        // should now be false
        expect(scope.remoteUsers[0].currentTab).toBe('new tab');

    });

    it('broadcasts an rtc:volumeChange when the volume has been altered for a remote user', function()
    {
        scope.$on('rtc:volumeChange', function(event, args)
        {
            expect(args.id).toBe('2');
            expect(args.volume).toBe(23);
        });

        scope.onVolumeChange('2', 23);
    });

});