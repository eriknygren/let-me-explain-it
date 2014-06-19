var proxyquire =  require('proxyquire');
var expect = require('chai').expect;
var nodemailer = require('../mocks/nodemailer');

describe('emailBusiness', function(){
    describe('sendForgotPasswordEmail(recipient, newPassword, callback)', function(){

        it('returns null when email is successfully sent', function(){

            var emailBusiness = proxyquire('../../business/emailBusiness', {
                'nodemailer': nodemailer.nodeMailerSuccessMock });

            emailBusiness.sendForgotPasswordEmail('test@mail.com', 'newPassword', callBackHandler);

            function callBackHandler(error) {

                expect(error).to.be.null;
            }
        });

        it('returns error when email is unsuccessfully sent', function(){

            var emailBusiness = proxyquire('../../business/emailBusiness', {
                'nodemailer': nodemailer.nodeMailerErrorMock });

            emailBusiness.sendForgotPasswordEmail('test@mail.com', 'newPassword', callBackHandler);

            function callBackHandler(error) {

                expect(error).to.exist;
            }
        });
    });
});

