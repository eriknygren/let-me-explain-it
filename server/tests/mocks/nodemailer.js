exports.nodeMailerSuccessMock = {
    createTransport: function(protocol, options) {
        return {
            sendMail: function(mailOptions, callback) {
                return callback(null, {message: 'test'});
            }
        }
    }
};

exports.nodeMailerErrorMock = {
    createTransport: function(protocol, options) {
        return {
            sendMail: function(mailOptions, callback) {
                return callback({ error: 'testError' }, null);
            }
        }
    }
};