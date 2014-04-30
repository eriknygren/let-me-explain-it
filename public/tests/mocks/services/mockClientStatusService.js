var mockClientStatusService = {

    userData:{},

    checkLoginStatus: function() {},

    broadCastRoomStatusUpdate: function(data) {},

    getRoomStatus: function(callback)
    {
        return callback({});
    },

    setUserData: function(name, email, picture, newLoggedInStatus) {
        this.userData.username = name;
        this.userData.email = email;

        if (picture)
        {
            this.userData.picture = picture;
        }

        this.userData.isLoggedIn = newLoggedInStatus;
    }
};