var socketBusiness = require('../business/socketBusiness');

exports.requestHandler = function(io)
{
    io.set('authorization', function(handshakeData, accept)
    {
        accept = socketBusiness.authorizeHandshake(handshakeData, accept, io)

        return accept;
    });

    io.sockets.on('connection', function(socket)
    {
        socketBusiness.socketConnectionHandler(socket, io);
    });
};