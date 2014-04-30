describe('InfoModalController spec', function()
{
    var scope, controller;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller)
    {
        scope = $rootScope.$new();

        controller = $controller;

    }));

    function setDefaultController()
    {
        controller('InfoModalController',
            {
                $scope: scope,
                dialog: mockDialog,
                title: 'test title',
                content: 'test content',
                easyCopyContent: 'test copy content'
            });
    }

    it('expects scope to be defined', function()
    {
        setDefaultController();
        expect(scope).toBeDefined();
    });

    it('shows defined easy copy content', function()
    {
        setDefaultController();
        expect(scope.showEasyCopyContent).toBe(true);
    });

    it('hides blank easy copy content', function()
    {
        controller('InfoModalController',
            {
                $scope: scope,
                dialog: mockDialog,
                title: 'test title',
                content: 'test content',
                easyCopyContent: ''
            });

        expect(scope.showEasyCopyContent).toBe(false);
    });

    it('closes the dialog on close clicked', function()
    {
        setDefaultController();
        spyOn(mockDialog, 'close');

        scope.close();

        expect(mockDialog.close).toHaveBeenCalled();
    });

});