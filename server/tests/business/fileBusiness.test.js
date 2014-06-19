var proxyquire =  require('proxyquire');
var expect = require('chai').expect;
var gm = require('../mocks/gm');
var fs = require('../mocks/fs');
var path = require('../mocks/path');

describe('fileBusiness', function(){
    describe('storeUserProfilePicture(image, callback)', function(){

        it('returns null when successfully saving an image', function(){

            var fileBusiness = proxyquire('../../business/fileBusiness', {
                'fs': fs,
                'gm': gm.success,
                'path': path
            });

            function callbackHandler(err) {
                expect(err).to.be.null;

            }

            fileBusiness.storeUserProfilePicture({path: 'testpath', name: 'testname'}, callbackHandler);

        });

        it('returns error when saving an image fails', function(){

            var fileBusiness = proxyquire('../../business/fileBusiness', {
                'fs': fs,
                'gm': gm.error,
                'path': path
            });

            function callbackHandler(err) {
                expect(err).to.exist;
            }

            fileBusiness.storeUserProfilePicture({path: 'testpath', name: 'testname'}, callbackHandler);
        });
    });
});
