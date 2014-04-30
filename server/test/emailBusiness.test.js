var proxyquire =  require('proxyquire');
var expect = require('chai').expect;

var nodeMailerSuccessMock = {
    createTransport: function(protocol, options) {
        return {
            sendMail: function(mailOptions, callback) {
                return callback(null, {message: 'test'});
            }
        }
    }
};

var nodeMailerErrorMock = {
    createTransport: function(protocol, options) {
        return {
            sendMail: function(mailOptions, callback) {
                return callback({ error: 'testError' }, null);
            }
        }
    }
};

describe('emailBusiness', function(){
    describe('sendForgotPasswordEmail(recipient, newPassword, callback)', function(){

        it('returns null when email is successfully sent', function(){

            var emailBusiness = proxyquire('../business/emailBusiness', {
                'nodemailer': nodeMailerSuccessMock });

            emailBusiness.sendForgotPasswordEmail('test@mail.com', 'newPassword', callBackHandler);

            function callBackHandler(error) {

                expect(error).to.be.null;
            }
        });

        it('returns error when email is unsuccessfully sent', function(){

            var emailBusiness = proxyquire('../business/emailBusiness', {
                'nodemailer': nodeMailerErrorMock });

            emailBusiness.sendForgotPasswordEmail('test@mail.com', 'newPassword', callBackHandler);

            function callBackHandler(error) {

                expect(error).to.exist;
            }
        });
    });
});

