var proxyquire =  require('proxyquire');
var expect = require('chai').expect;

var fs = {
    unlink: function(path, callback) {
        return callback(null);
    }
};

var gmSuccess = {
    subClass: function(options) {
        return function gm(source){
            this.resize = function(width, height, options){
                return this;
            };
            this.write = function(targetPath, callback){
                return callback(null);
            };
            return this;
        }
    }
};

var gmError = {
    subClass: function(options) {
        return function gm(source){
            this.resize = function(width, height, options){
                return this;
            };
            this.write = function(targetPath, callback){
                // return an error
                return callback({});
            };
            return this;
        }
    }
};

var path = {
    resolve: function(path) {
        return path;
    }
};

describe('fileBusiness', function(){
    describe('storeUserProfilePicture(image, callback)', function(){

        it('returns null when successfully saving an image', function(){

            var fileBusiness = proxyquire('../business/fileBusiness', {
                'fs': fs,
                'gm': gmSuccess,
                'path': path
            });

            function callbackHandler(err) {
                expect(err).to.be.null;

            }

            fileBusiness.storeUserProfilePicture({path: 'testpath', name: 'testname'}, callbackHandler);

        });

        it('returns error when saving an image fails', function(){

            var fileBusiness = proxyquire('../business/fileBusiness', {
                'fs': fs,
                'gm': gmError,
                'path': path
            });

            function callbackHandler(err) {
                expect(err).to.exist;
            }

            fileBusiness.storeUserProfilePicture({path: 'testpath', name: 'testname'}, callbackHandler);
        });
    });
});
