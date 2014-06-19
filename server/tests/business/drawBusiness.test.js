var expect = require('chai').expect;
var drawBusiness = require("../../business/drawBusiness");

describe('drawBusiness', function(){
    describe('isResizeValid(width, height)', function(){

        it('should return false when passing null for width and height', function(){
            var result = drawBusiness.isResizeValid(null, null);

            expect(result).to.equal(false);
        });

        it('should return false when passing null for width', function(){
            var result = drawBusiness.isResizeValid(null, 255);

            expect(result).to.equal(false);
        });

        it('should return false when passing null for height', function(){
            var result = drawBusiness.isResizeValid(255, null);

            expect(result).to.equal(false);
        });

        it('should return false when passing values that are not integers', function(){
            var result = drawBusiness.isResizeValid(255, 'aaa');

            expect(result).to.equal(false);
        });

        it('should return false when width is less than 100px', function(){
            var result = drawBusiness.isResizeValid(99, 255);

            expect(result).to.equal(false);
        });

        it('should return false when width is more than 2000px', function(){
            var result = drawBusiness.isResizeValid(2001, 255);

            expect(result).to.equal(false);
        });

        it('should return false when height is less than 100px', function(){
            var result = drawBusiness.isResizeValid(255, 99);

            expect(result).to.equal(false);
        });


        it('should return false when height is more than 2000px', function(){
            var result = drawBusiness.isResizeValid(255, 2001);

            expect(result).to.equal(false);
        });

        it('should return true when passing two valid integers', function(){
            var result = drawBusiness.isResizeValid(255, 255);

            expect(result).to.equal(true);
        });

        it('should convert string values and return true when passing valid integers as strings', function(){
            var result = drawBusiness.isResizeValid('255', '255');

            expect(result).to.equal(true);
        });

    });
});

