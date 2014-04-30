/************************************* vLine functions ************************************/
var jwt = require('green-jwt');
var serviceId = 'letmeexplainit';   // replace with your service ID
var apiSecret = 'QFm7aXC-QpX5bPl8lv9S0onZsnWZxFN_sVWJv8M0g5k';   // replace with your API Secret

exports.createToken = function(userId) {
    var exp = new Date().getTime() + (48 * 60 * 60);     // 2 days in seconds

    return createAuthToken(serviceId, userId, exp, apiSecret);
}

exports.getServiceID = function() {
    return serviceId;
}

function createAuthToken(serviceId, userId, expiry, apiSecret) {
    var subject = serviceId + ':' + userId;
    var payload = {'iss': serviceId, 'sub': subject, 'exp': expiry};
    var apiSecretKey = base64urlDecode(apiSecret);
    return jwt.encode(payload, apiSecretKey);
}

function base64urlDecode(str) {
    return new Buffer(base64urlUnescape(str), 'base64');
}

function base64urlUnescape(str) {
    str += Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
}
/************************************* vLine functions ************************************/