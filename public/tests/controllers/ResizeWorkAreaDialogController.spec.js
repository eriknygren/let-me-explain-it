describe('ResizeWorkAreaDialogController spec', function()
{
    var scope, location;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $location)
    {
        scope = $rootScope.$new();
        location = $location;

        $controller('ResizeWorkAreaDialogController', {
            $scope: scope,
            dialog: mockDialog
        });

    }));

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('returns object with dimensions if onOkClicked with selectedOption as manual', function()
    {
        spyOn(mockDialog, 'close');

        scope.height = '931';
        scope.width = '312';

        scope.onOkClicked('manual');

        expect(mockDialog.close).toHaveBeenCalledWith({
            height: scope.height, width: scope.width, selectedOption: 'manual'});
    });

    it('returns object with selectedOption if other option clicked', function()
    {
        spyOn(mockDialog, 'close');

        scope.onOkClicked('optimized');

        expect(mockDialog.close).toHaveBeenCalledWith({selectedOption: 'optimized'});
    });

});