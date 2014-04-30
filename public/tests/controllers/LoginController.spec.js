describe('LoginController spec', function()
{
    var scope, httpBackend, controller;

    beforeEach(angular.mock.module('angularApp'));

    beforeEach(angular.mock.inject(function($rootScope, $controller, $httpBackend)
    {
        scope = $rootScope.$new();

        httpBackend = $httpBackend;

        controller = $controller;

    }));

    afterEach(function () {
        $.removeCookie('token');
    });

    function setController()
    {
        controller('LoginController', {
            $scope: scope,
            clientStatusService: mockClientStatusService,
            $dialog: mock$dialog
        });
    }



    it('expects scope to be defined', function()
    {
        setController();
        expect(scope).toBeDefined();
    });

    it('checks and gets login status if a token cookie is available and sets isLoggedIn to true if 20x response', function()
    {
        $.cookie('token', '12345');

        var data = {name:'Test', email: 'em@i.l'};

        httpBackend.expect('POST', '/api/getUser').respond(201, data);

        setController();

        httpBackend.flush();

        expect(scope.user.username).toBe(data.name);
        expect(scope.user.email).toBe(data.email);
        expect(scope.isLoaded).toBe(true);
        expect(scope.isLoggedIn).toBe(true);

    });

    it('checks and gets login status if a token cookie is available and sets isLoggedIn to false if 40x response', function()
    {
        $.cookie('token', '12345');

        httpBackend.expect('POST', '/api/getUser').respond(401, {});

        setController();

        httpBackend.flush();

        expect(scope.isLoaded).toBe(true);
        expect(scope.isLoggedIn).toBe(false);
    });

    it('opens a dialog onUserSettingsClicked', function()
    {
        setController();

        mock$dialog.createdDialogInstance = false;

        scope.onUserSettingsClicked();

        expect(mock$dialog.createdDialogInstance).toBe(true);
    });

    it('opens a dialog onForgotPasswordClicked', function()
    {
        setController();

        mock$dialog.createdDialogInstance = false;

        scope.onForgotPasswordClicked();

        expect(mock$dialog.createdDialogInstance).toBe(true);
    });

    it('displays error message when attempting to log in  with blank email/username and password', function()
    {
        setController();

        scope.loginErrorText = '';
        scope.username = '';
        scope.password = '';
        scope.onLoginClicked();

        expect(scope.showLoginErrorText).toBe(true);
        expect(scope.loginErrorText).toMatch('Please fill in all fields');
    });

    it('displays error message when attempting to log in  with blank email/username', function()
    {
        setController();

        scope.loginErrorText = '';
        scope.username = '';
        scope.password = 'validPassword';
        scope.onLoginClicked();

        expect(scope.showLoginErrorText).toBe(true);
        expect(scope.loginErrorText).toMatch('Please fill in all fields');
    });

    it('displays error message when attempting to log in  with blank password', function()
    {
        setController();

        scope.loginErrorText = '';
        scope.username = 'validUsername';
        scope.password = '';
        scope.onLoginClicked();

        expect(scope.showLoginErrorText).toBe(true);
        expect(scope.loginErrorText).toMatch('Please fill in all fields');
    });

    it('passes through valid login to server and sets user data when getting 20x login response', function()
    {
        setController();

        spyOn(mockClientStatusService, 'setUserData');

        expect(scope.isLoggedIn).toBe(false);
        httpBackend.expect('POST', '/api/login').respond(201, {});

        scope.username = 'validUsername';
        scope.password = 'validPassword';
        scope.onLoginClicked();

        httpBackend.flush();

        expect(scope.isLoggedIn).toBe(true);
        expect(mockClientStatusService.setUserData).toHaveBeenCalled();
    });

    it('passes through valid login to server and shows error message when getting 40x login response', function()
    {
        setController();

        httpBackend.expect('POST', '/api/login').respond(401, 'bad credentials');

        scope.username = 'validUsername';
        scope.password = 'wrongPassword';
        scope.onLoginClicked();

        httpBackend.flush();

        expect(scope.isLoggedIn).toBe(false);
        expect(scope.showLoginErrorText).toBe(true);
        expect(scope.loginErrorText).toBe('bad credentials');
    });

    it('clears user data when logging out successfully', function()
    {
        $.cookie('token', '12345');

        var data = {name:'Test', email: 'em@i.l'};

        httpBackend.expect('POST', '/api/getUser').respond(201, data);

        setController();
        httpBackend.flush();

        // should now be logged in at this stage
        expect(scope.isLoggedIn).toBe(true);

        spyOn(mockClientStatusService, 'setUserData');

        httpBackend.expect('POST', '/api/logout').respond(201, {});

        scope.onLogoutClicked();

        httpBackend.flush();

        expect(scope.isLoggedIn).toBe(false);
        expect(mockClientStatusService.setUserData).toHaveBeenCalledWith("", "", "", false);
    });

    it('does not clear user data when logging out unsuccessfully', function()
    {
        $.cookie('token', '12345');

        var data = {name:'Test', email: 'em@i.l'};

        httpBackend.expect('POST', '/api/getUser').respond(201, data);

        setController();
        httpBackend.flush();

        // should now be logged in at this stage
        expect(scope.isLoggedIn).toBe(true);

        spyOn(mockClientStatusService, 'setUserData');

        httpBackend.expect('POST', '/api/logout').respond(401, {});

        scope.onLogoutClicked();

        httpBackend.flush();

        // Should still be true as logout responded with 401
        expect(scope.isLoggedIn).toBe(true);
    });

    it('displays error message when attempting to register with blank fields', function()
    {
        setController();

        scope.registerUsername = '';
        scope.registerEmail = '';
        scope.registerPassword = '';

        scope.registerUser();

        expect(scope.showRegistrationErrorText).toBe(true);
        expect(scope.registrationErrorText).toMatch('Please fill in all fields');
    });

    it('displays error message when attempting to register with blank username', function()
    {
        setController();

        scope.registerUsername = '';
        scope.registerEmail = 'valid@email.com';
        scope.registerPassword = 'validPassword';

        scope.registerUser();

        expect(scope.showRegistrationErrorText).toBe(true);
        expect(scope.registrationErrorText).toMatch('Please fill in all fields');
    });

    it('displays error message when attempting to register with blank email', function()
    {
        setController();

        scope.registerUsername = 'validUsername';
        scope.registerEmail = '';
        scope.registerPassword = 'validPassword';

        scope.registerUser();

        expect(scope.showRegistrationErrorText).toBe(true);
        expect(scope.registrationErrorText).toMatch('Please fill in all fields');
    });

    it('displays error message when attempting to register with blank password', function()
    {
        setController();

        scope.registerUsername = 'validUsername';
        scope.registerEmail = 'valid@email.com';
        scope.registerPassword = '';

        scope.registerUser();

        expect(scope.showRegistrationErrorText).toBe(true);
        expect(scope.registrationErrorText).toMatch('Please fill in all fields');
    });

    it('passes filled in registration form to server and logs in if 20x response', function()
    {
        setController();

        expect(scope.isLoggedIn).toBe(false);

        spyOn(mockClientStatusService, 'setUserData');

        httpBackend.expect('POST', '/api/registerUser').respond(201, {});

        scope.registerUsername = 'validUsername';
        scope.registerEmail = 'valid@email.com';
        scope.registerPassword = 'validPassword';

        scope.registerUser();

        httpBackend.flush();

        expect(scope.showRegistrationErrorText).toBe(false);
        expect(scope.isLoggedIn).toBe(true);
        expect(mockClientStatusService.setUserData).toHaveBeenCalled();
    });

    it('passes filled in registration form to server and shows error if 40x response', function()
    {
        setController();

        httpBackend.expect('POST', '/api/registerUser').respond(401, 'test error');

        scope.registerUsername = 'invalidUsername';
        scope.registerEmail = 'invalid@email.com';
        scope.registerPassword = 'invalidPassword';

        scope.registerUser();

        httpBackend.flush();

        expect(scope.showRegistrationErrorText).toBe(true);
        expect(scope.isLoggedIn).toBe(false);
        expect(scope.registrationErrorText).toBe('test error');
    });

});