function fs(){}

fs.prototype.unlink = function(path, callback) {
    return callback(null);
};

module.exports = new fs();