function GMSuccess() {}

GMSuccess.prototype.subClass = function(options) {
    return function gm(source){
        this.resize = function(width, height, options){
            return this;
        };
        this.write = function(targetPath, callback){
            return callback(null);
        };
        return this;
    }
};

function GMError() {}

GMError.prototype.subClass = function(options) {
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
};


exports.success = new GMSuccess();
exports.error = new GMError();