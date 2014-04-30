describe('YesNoModalController spec', function()
{
    var scope;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller)
    {
        scope = $rootScope.$new();

        $controller('YesNoModalController',
            {
                $scope: scope,
                dialog: mockDialog,
                title: 'test title',
                content: 'test content'
            });

    }));

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('closes the dialog with true result on confirm clicked', function()
    {
        spyOn(mockDialog, 'close');

        scope.confirm();

        expect(mockDialog.close).toHaveBeenCalledWith(true);
    });

    it('closes the dialog with false result on cancel clicked', function()
    {
        spyOn(mockDialog, 'close');

        scope.cancel();

        expect(mockDialog.close).toHaveBeenCalledWith(false);
    });

});