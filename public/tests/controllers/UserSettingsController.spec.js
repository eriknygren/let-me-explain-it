describe('UserSettingsController spec', function()
{
    var scope;
    var httpBackend;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $httpBackend)
    {
        scope = $rootScope.$new();

        httpBackend = $httpBackend;

        $controller('UserSettingsController', { $scope: scope, $upload: mockUpload, dialog: mockDialog });

    }));

    it('expects scope to be defined', function()
    {
        expect(scope).toBeDefined();
    });

    it('expects changeView to update the CURRENT_VIEW model', function()
    {
        scope.CURRENT_VIEW = 'otherView';

        scope.changeView('testView');

        expect(scope.CURRENT_VIEW).toMatch('testView');
    });

    it('displays error message when attempting to edit user settings with blank email', function()
    {
        scope.errorText = '';
        scope.email = '';
        scope.username = 'validUsername';
        scope.editUserSettings();

        expect(scope.showErrorText).toBe(true);
        expect(scope.errorText).toMatch('Please fill in all fields');
    });

    it('displays error message when attempting to edit user settings with blank username', function()
    {
        scope.errorText = '';
        scope.email = 'valid@email.com';
        scope.username = '';
        scope.editUserSettings();

        expect(scope.showErrorText).toBe(true);
        expect(scope.errorText).toMatch('Please fill in all fields');
    });

    it('displays success message on altering user details with HTTP 201 response', function()
    {
        httpBackend.expect('POST', '/api/editUserDetails').respond(201,
            {
                name: 'validUsername',
                email: 'valid@email.com'
            });

        scope.email = 'valid@email.com';
        scope.username = 'validUsername';
        scope.editUserSettings();

        httpBackend.flush();

        expect(scope.showErrorText).toBe(false);
        expect(scope.showSuccessText).toBe(true);
        expect(scope.successText).toMatch('Details successfully altered');
    });

    it('displays error message on altering user details with HTTP 40x response', function()
    {
        httpBackend.expect('POST', '/api/editUserDetails').respond(401, "test error");

        scope.email = 'valid@email.com';
        scope.username = 'validUsername';
        scope.editUserSettings();

        httpBackend.flush();

        expect(scope.showErrorText).toBe(true);
        expect(scope.showSuccessText).toBe(false);
        expect(scope.errorText).toMatch('test error');
    });

    it('displays error message when attempting to edit password with blank password field', function()
    {
        scope.errorText = '';
        scope.password = '';
        scope.password2 = 'newPassword';
        scope.oldPassword = 'oldPassword';
        scope.editUserPassword();

        expect(scope.showErrorText).toBe(true);
        expect(scope.errorText).toMatch('Please fill in all fields');
    });

    it('displays error message when attempting to edit password with blank password2 field', function()
    {
        scope.errorText = '';
        scope.password = 'newPassword';
        scope.password2 = '';
        scope.oldPassword = 'oldPassword';
        scope.editUserPassword();

        expect(scope.showErrorText).toBe(true);
        expect(scope.errorText).toMatch('Please fill in all fields');
    });

    it('displays error message when attempting to edit password with blank oldPassword field', function()
    {
        scope.errorText = '';
        scope.password = 'newPassword';
        scope.password2 = 'newPassword';
        scope.oldPassword = '';
        scope.editUserPassword();

        expect(scope.showErrorText).toBe(true);
        expect(scope.errorText).toMatch('Please fill in all fields');
    });

    it('displays error message when attempting to edit password when new passwords do not match', function()
    {
        scope.errorText = '';
        scope.password = 'newPassword';
        scope.password2 = 'newPassword2';
        scope.oldPassword = 'oldPassword';
        scope.editUserPassword();

        expect(scope.showErrorText).toBe(true);
        expect(scope.errorText).toMatch('New passwords do not match');
    });

    it('displays success message when changing user password with HTTP 201 response', function()
    {
        httpBackend.expect('POST', '/api/editUserPassword').respond(201, 'success');

        scope.password = 'newPassword';
        scope.password2 = 'newPassword';
        scope.oldPassword = 'oldPassword';
        scope.editUserPassword();

        httpBackend.flush();

        expect(scope.showErrorText).toBe(false);
        expect(scope.showSuccessText).toBe(true);
        expect(scope.successText).toMatch('success');
    });

    it('displays error message when changing user password with HTTP 40x response', function()
    {
        httpBackend.expect('POST', '/api/editUserPassword').respond(401, 'error');

        scope.password = 'newPassword';
        scope.password2 = 'newPassword';
        scope.oldPassword = 'oldPassword';
        scope.editUserPassword();

        httpBackend.flush();

        expect(scope.showErrorText).toBe(true);
        expect(scope.showSuccessText).toBe(false);
        expect(scope.errorText).toMatch('error');
    });

    it('displays success message if delete picture returns HTTP 201 response', function()
    {
        httpBackend.expect('POST', '/api/deleteUserPicture').respond(201);
        scope.deleteUserPicture();

        httpBackend.flush();

        expect(scope.showErrorText).toBe(false);
        expect(scope.showSuccessText).toBe(true);
        expect(scope.successText).toMatch('Picture successfully removed');
    });

    it('displays error message if delete picture returns HTTP 40x response', function()
    {
        httpBackend.expect('POST', '/api/deleteUserPicture').respond(401, 'error');
        scope.deleteUserPicture();

        httpBackend.flush();

        expect(scope.showErrorText).toBe(true);
        expect(scope.showSuccessText).toBe(false);
        expect(scope.errorText).toMatch('error');
    });

    it('displays error message if edit picture is called with undefined image', function()
    {
        scope.editUserPicture();

        expect(scope.showErrorText).toBe(true);
        expect(scope.showSuccessText).toBe(false);
        expect(scope.errorText).toMatch('Please select an image');
        expect(mockUpload._calledUpload).toBe(false);
    });

    it('displays error message if edit picture is called with null image', function()
    {
        scope.onUploadFileChanged([null]);
        scope.editUserPicture();

        expect(scope.showErrorText).toBe(true);
        expect(scope.showSuccessText).toBe(false);
        expect(scope.errorText).toMatch('Please select an image');
        expect(mockUpload._calledUpload).toBe(false);
    });

    it('displays error message if edit picture is called with undefined file type', function()
    {
        scope.onUploadFileChanged([{}]);
        scope.editUserPicture();

        expect(scope.showErrorText).toBe(true);
        expect(scope.showSuccessText).toBe(false);
        expect(scope.errorText).toMatch('Please select an image');
        expect(mockUpload._calledUpload).toBe(false);
    });

    it('displays error message if edit picture is called with incorrect file type', function()
    {
        scope.onUploadFileChanged([{type: 'wrongType'}]);
        scope.editUserPicture();

        expect(scope.showErrorText).toBe(true);
        expect(scope.showSuccessText).toBe(false);
        expect(scope.errorText).toMatch('Please select an image');
        expect(mockUpload._calledUpload).toBe(false);
    });

    it('displays error message if edit picture is called with larger image than 3mb', function()
    {
        scope.onUploadFileChanged([{type: 'image/jpeg', size: 4000000}]);
        scope.editUserPicture();

        expect(scope.showErrorText).toBe(true);
        expect(scope.showSuccessText).toBe(false);
        expect(scope.errorText).toMatch('Image needs to be smaller than 3mb');
        expect(mockUpload._calledUpload).toBe(false);
    });

    it('validates and attempts to upload image with appropriate file type and size', function()
    {
        scope.onUploadFileChanged([{type: 'image/jpeg', size: 2000000}]);
        scope.editUserPicture();

        expect(mockUpload._calledUpload).toBe(true);
    });

    it('closes the dialog onCloseClicked', function()
    {
        spyOn(mockDialog, 'close');

        scope.onCloseClicked();

        expect(mockDialog.close).toHaveBeenCalled();
    });
});