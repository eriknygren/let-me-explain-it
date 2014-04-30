describe('ToolbarController spec', function()
{
    var scope, httpBackend;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $httpBackend)
    {
        scope = $rootScope.$new();

        httpBackend = $httpBackend;

        $controller('ToolbarController',
            {
                $scope: scope,
                $dialog: mock$dialog,
                socketIOService: mockSocketIOService
            });

    }));

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('changes activeTab model on tab:change event', function()
    {
        scope.$broadcast('tab:change', 'testTabName');

        expect(scope.activeTab).toMatch('testTabName');
    });

    it('opens invite friends dialog onInviteFriendsClicked', function()
    {
        mock$dialog.createdDialogInstance = false;

        scope.onInviteFriendsClicked();

        expect(mock$dialog.createdDialogInstance).toBe(true);
    });

    it('opens resize dialog onResizeClicked', function()
    {
        mock$dialog.createdDialogInstance = false;

        scope.onResizeClicked();

        expect(mock$dialog.createdDialogInstance).toBe(true);
    });

    it('opens reset dialog onResetClicked', function()
    {
        mock$dialog.createdDialogInstance = false;

        scope.onResetClicked();

        expect(mock$dialog.createdDialogInstance).toBe(true);
    });

    it('starts following a user when calling follow user', function()
    {
        scope.followUser(2);

        scope.$on('map:following', function(event, args)
        {
            expect(args.followUser).toBe(2);
            expect(scope.isFollowing).toBe(true);
        });
    });

    it('broadcasts a map following status change when isFollowing model changes to false', function()
    {
        scope.$on('map:following', function(event, args)
        {
            expect(args.followUser).toBe(null);
            expect(scope.isFollowing).toBe(true);
        });

        scope.isFollowing = false;
    });

    it('broadcasts canvas:brushColor event when changing the brushColor model', function()
    {
        scope.$on('canvas:brushColor', function(event, args)
        {
            expect(args).toBe("#FF00EE");
        });

        scope.brushColor = "#FF00EE";
    });

    it('updates remoteUsers model on remoteUsers:update event', function()
    {
        var testUsers = {
            user1: { name: 'Test', email: 'Test@test.com'},
            user2: { name: 'Test', email: 'Test@test.com'}
        }

        scope.$broadcast('remoteUsers:update', testUsers);

        expect(scope.remoteUsers).toBe(testUsers);
    });

});