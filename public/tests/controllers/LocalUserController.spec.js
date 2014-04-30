describe('LocalUserController spec', function()
{
    var scope, controller;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller)
    {
        scope = $rootScope.$new();

        controller = $controller;

    }));

    function setController(webRTCService)
    {
        controller('LocalUserController',
            {
                $scope: scope,
                $dialog: mock$dialog,
                clientStatusService: mockClientStatusService,
                socketIOService: mockSocketIOService,
                webRTCService: webRTCService
            });
    }

    it('expects scope to be defined', function()
    {
        setController({});
        expect(scope).toBeDefined();
    });

    it('opens a dialog when calling showLocalUserOptions', function()
    {
        setController({});

        mock$dialog.createdDialogInstance = false;

        scope.showLocalUserOptions();

        expect(mock$dialog.createdDialogInstance).toBe(true);
    });

    it('states that WebRTC is supported if the webRTCService is not null', function()
    {
        setController({});

        expect(scope.isWebRTCSupported).toBe(true);
    });

    it('states that WebRTC is NOT supported if the webRTCService is null', function()
    {
        setController(null);

        expect(scope.isWebRTCSupported).toBe(false);
    });

    it('broadcasts a local rtc:enabledStatusChange event when the isVoiceChatEnabled model is altered', function()
    {
        setController({});

        scope.$on('rtc:enabledStatusChange', function(event, args)
        {
            expect(args).toBe(true);
        });

        scope.isVoiceChatEnabled = true;
    });

    it('broadcasts a local rtc:enabledStatusChange event when the isVoiceChatEnabled model is altered', function()
    {
        setController({});

        scope.$on('rtc:enabledStatusChange', function(event, args)
        {
            expect(args).toBe(true);
        });

        scope.isVoiceChatEnabled = true;
    });

    it('emits a socket.io rtc:enabled event when the isVoiceChatEnabled model is set to true', function()
    {
        setController({});
        spyOn(mockSocketIOService, 'emit');

        var expectedData =
        {
            socketID: '12345',
            rtcID: null
        };

        scope.isVoiceChatEnabled = true;

        // Give the event some time to have been emitted (yes, race conditioning)
        setInterval(function()
        {
            expect(mockSocketIOService.emit).toHaveBeenCalledWith('rtc:enabled', expectedData);

        },200);

    });

    it('emits a socket.io rtc:disabled event when the isVoiceChatEnabled model is set to false', function()
    {
        setController({});
        spyOn(mockSocketIOService, 'emit');

        var expectedData =
        {
            socketID: '12345',
            rtcID: null
        };

        scope.isVoiceChatEnabled = false;

        setInterval(function()
        {
            expect(mockSocketIOService.emit).toHaveBeenCalledWith('rtc:disabled', expectedData);

        },200);

    });

    it('updates the username and picture model on the localUser:update event', function()
    {
        setController({});

        scope.username = "previous";
        scope.picture = {src: "previous"};

        scope.$broadcast('localUser:update', {username: "new", picture:{src:"new"}});

        expect(scope.username).toBe("new");
        expect(scope.picture.src).toBe("new");

    });

});