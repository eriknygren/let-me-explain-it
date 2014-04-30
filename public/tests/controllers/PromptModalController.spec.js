describe('PromptModalController spec', function()
{
    var scope, location;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $location)
    {
        scope = $rootScope.$new();
        location = $location;

        $controller('PromptModalController', {
            $scope: scope,
            dialog: mockDialog,
            title: 'test title',
            inputText: ''
        });

    }));

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('closes the dialog with the result from input text model when clicking save', function()
    {
        spyOn(mockDialog, 'close');
        scope.inputText = 'test input text';
        scope.save();

        expect(mockDialog.close).toHaveBeenCalledWith('test input text');
    });

    it('closes the dialog without result when clicking cancel', function()
    {
        spyOn(mockDialog, 'close');
        scope.cancel();

        expect(mockDialog.close).toHaveBeenCalledWith();
    });

});