exports.requestHandler = function(express, app)
{
    var views = require('./../business/viewRenderBusiness')
    var room = require('./../business/roomBusiness')
    var user = require('./../business/userBusiness')

    app.use(app.router);
    app.use(express.static(__dirname + '../../../public'));

    app.get('/', views.base);
    app.get('/room/:roomName', views.base);
    app.get('/notSupported', views.base);
    app.get('/partials/:filename', views.partials);
    app.get('/modals/:filename', views.modals)

    // If some partial file require some service work, put a special
    // route for those requests like this over the more generic 'app.get :filename'.
    /*app.get('/partials/somepartialfile', index.specialaction);*/

    app.post('/api/login', user.loginRequest);
    app.post('/api/logout', user.logoutRequest);
    app.post('/api/getUser', user.getUserFromSessionIDRequest);
    app.post('/api/registerUser', user.registerUserRequest);
    app.post('/api/editUserDetails', user.editUserDetailsRequest);
    app.post('/api/editUserPassword', user.editUserPasswordRequest);
    app.post('/api/editUserPicture', user.editUserPictureRequest);
    app.post('/api/deleteUserPicture', user.deleteUserPictureRequest);
    app.post('/api/resetUserPassword', user.resetForgottenPasswordRequest);
    app.post('/api/joinRoom', room.joinRoomRequest);
}