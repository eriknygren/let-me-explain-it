var expect = require('chai').expect;

var util = require("../helpers/util");

describe('util', function(){
    describe('isNullOrUndefined(value)', function(){

        it('should return true when passing undefined object', function(){
            var result = util.isNullOrUndefined();

            expect(result).to.equal(true);
        });

        it('should return false when passing defined object', function(){

            var result = util.isNullOrUndefined({});

            expect(result).to.equal(false);
        });
    });
});

