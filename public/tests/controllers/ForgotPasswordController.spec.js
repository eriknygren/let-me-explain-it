describe('ForgotPasswordController spec', function()
{
    var scope, httpBackend;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $httpBackend)
    {
        scope = $rootScope.$new();

        httpBackend = $httpBackend;

        $controller('ForgotPasswordController', { $scope: scope, dialog: mockDialog, clientStatusService: mockClientStatusService });

    }));

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('shows error message when attempting to reset password without supplying an email', function()
    {
        scope.email = '';
        scope.resetPassword();

        expect(scope.showErrorText).toBe(true);
        expect(scope.errorText).toMatch('Please fill in all fields');
    });

    it('displays success message when resetting user password with HTTP 201 response', function()
    {
        httpBackend.expect('POST', '/api/resetUserPassword').respond(201, 'success');

        scope.email = 'valid@email.com';
        scope.resetPassword();

        httpBackend.flush();

        expect(scope.showErrorText).toBe(false);
        expect(scope.showSuccessText).toBe(true);
        expect(scope.successText).toMatch('success');
    });

    it('displays error message when resetting user password with HTTP 40x response', function()
    {
        httpBackend.expect('POST', '/api/resetUserPassword').respond(401, 'error');

        scope.email = 'valid@email.com';
        scope.resetPassword();

        httpBackend.flush();

        expect(scope.showErrorText).toBe(true);
        expect(scope.showSuccessText).toBe(false);
        expect(scope.errorText).toMatch('error');
    });


    it('closes the dialog onCloseClicked', function()
    {
        spyOn(mockDialog, 'close');

        scope.onCloseClicked();

        expect(mockDialog.close).toHaveBeenCalled();
    });

});