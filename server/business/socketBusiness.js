var sessionPersistence = require('../persistence/sessionPersistence');
var roomPersistence = require('../persistence/roomPersistence');
var userPersistence = require('../persistence/userPersistence');
var statisticPersistence = require('../persistence/statisticPersistence');
var roomBusiness = require('../business/roomBusiness');
var webRTCBusiness = require('../business/webRTCBusiness')
var drawBusiness = require('../business/drawBusiness');
var util = require('../helpers/util');
var cookie = require('cookie');

var DEFAULT_PROFILE_PICTURE_PATH = "/images/blank-avatar.jpg";

var DRAWING_BOARD_TAB_NAME = "Drawing Board";
var MAPS_TAB_NAME = "Maps";

exports.authorizeHandshake = function(handshakeData, accept, io)
{
    var roomName = handshakeData.headers.referer.replace("http://"+handshakeData.headers.host+"/room/","").toLowerCase();

    var validationResult = roomBusiness.validateRoomName(roomName);

    if (!validationResult.valid)
    {
        return accept(validationResult.message, false);
    }

    if (handshakeData.headers.cookie)
    {
        var cookies = cookie.parse(handshakeData.headers.cookie);

        var sessionID = cookies['token'];

        roomBusiness.setupRoom(roomName, sessionID, setUpRoomCallBack)
    }
    else
    {
        roomBusiness.setupRoom(roomName, null, setUpRoomCallBack)
    }


    function setUpRoomCallBack(result)
    {
        if (!result.success)
        {
            return accept('error setting up room', false);
        }

        var clients = io.sockets.clients(result.roomID);

        // Sometimes we get this weird thing where a socket.io client tries to
        // open two socket connections, this will disallow that.
        if (doesClientAlreadyExist(clients, sessionID))
        {
            return accept('Client already connected to room', false);
        }

        console.log(handshakeData.address.address);
        handshakeData.token = result.sessionID;
        handshakeData.roomID = result.roomID;
        handshakeData.picture = DEFAULT_PROFILE_PICTURE_PATH;

        if (!result.isRegisteredUser)
        {
            handshakeData.isRegisteredUser = false;
            // Give the guest a temporary name with a random number
            handshakeData.username = "Guest" + Math.floor(Math.random() * 9999) + 1;
            accept(null, true);
            return;
        }

        userPersistence.getUserDataByID(result.userID, function(err, user)
        {
            if (err)
            {
                console.log(err);
                return accept('error', false);
            }

            if (util.isNullOrUndefined(user))
            {
                handshakeData.isRegisteredUser = false;
                handshakeData.username = "Guest" + Math.floor(Math.random() * 9999) + 1;
                accept(null, true);
                return;
            }

            if(!util.isNullOrUndefined(user.picture))
            {
                handshakeData.picture = user.picture;
            }

            handshakeData.isRegisteredUser = true;
            handshakeData.username = user.name;
            accept(null, true);
        });
    }
}

exports.socketConnectionHandler = function(socket, io)
{
    var roomID = socket.handshake.roomID;
    var sessionID = socket.handshake.token;
    socket.joinDate = new Date();
    socket.isVoiceChatEnabled = false;
    socket.currentTab = DRAWING_BOARD_TAB_NAME;
    socket.mapMarkers = [];
    socket.join(roomID);

    // Statistics gathering
    var lastTabChange = new Date();
    var voiceChatActivationDateTime = null;
    var mapFollowingActivationDateTime = null;
    var statistics =
    {
        secondsSpentOnDrawTab: 0,
        secondsSpentOnMapsTab: 0,
        secondsSpentInVoiceChat: 0,
        secondsSpentInMapFollowFeature: 0,
        totalChatMessagesSent: 0,
        totalMapMarkersAdded: 0,
        isRegisteredUser: socket.handshake.isRegisteredUser
    };

    initializeUser();

    socket.on('disconnect', onDisconnectHandler);
    socket.on('chat:message', onChatMessageHandler);
    socket.on('canvas:draw', onDrawingBoardDrawHandler);
    socket.on('canvas:resize', onDrawingBoardResizeHandler);
    socket.on('canvas:reset', onDrawingBoardResetHandler);
    socket.on('map:positionUpdate', onMapPositionUpdateHandler);
    socket.on('map:markerAdd', onMapMarkerAddedHandler);
    socket.on('map:markerRemove', onMapMarkerRemovedHandler);
    socket.on('map:markerTitleEdit', onMapMarkerTitleEditedHandler);
    socket.on('map:following', onMapFollowingStatusChangeHandler);
    socket.on('rtc:enabled', onRTCEnabledHandler);
    socket.on('rtc:disabled', onRTCDisabledHandler);
    socket.on('tab:change',onTabChangedHandler);

    function onTabChangedHandler(data)
    {
        recordTabUsageStatistics();

        socket.currentTab = data.newValue;
        socket.in(roomID).broadcast.emit('tab:change', data);
    }

    function onRTCDisabledHandler(data)
    {
        recordVoiceChatUsageStatistics();

        socket.in(roomID).broadcast.emit('rtc:disabled', data);
        socket.isVoiceChatEnabled = false;
    }

    function onRTCEnabledHandler(data)
    {
        voiceChatActivationDateTime = new Date();
        socket.in(roomID).broadcast.emit('rtc:enabled', data);
        socket.isVoiceChatEnabled = true;
    }

    function onMapPositionUpdateHandler(data)
    {
        data.userID = socket.id;
        socket.in(roomID).broadcast.emit('map:positionUpdate', data);
    }

    function onMapMarkerAddedHandler(args)
    {
        if (args.latitude && args.longitude && args.title)
        {
            statistics.totalMapMarkersAdded++;
            socket.in(roomID).broadcast.emit('map:markerAdd', args);
        }
    }

    function onMapMarkerRemovedHandler(marker)
    {
        socket.in(roomID).broadcast.emit('map:markerRemove', marker);
    }

    function onMapMarkerTitleEditedHandler(marker)
    {
        socket.in(roomID).broadcast.emit('map:markerTitleEdit', marker);
    }

    function onMapFollowingStatusChangeHandler(args)
    {
        if (util.isNullOrUndefined(args))
        {
            return;
        }

        if (args.isFollowing)
        {
            mapFollowingActivationDateTime = new Date();
        }
        else
        {
            recordMapFollowingUsageStatistics();
        }
    }

    function onDrawingBoardResetHandler(args)
    {
        io.sockets.in(roomID).emit('canvas:reset', args);
    }

    function onDrawingBoardResizeHandler(args)
    {
        if (drawBusiness.isResizeValid(args.width, args.height))
        {
            io.sockets.in(roomID).emit('canvas:resize', args);
        }
    }

    function onDrawingBoardDrawHandler(data)
    {
        console.log(data);
        socket.broadcast.in(roomID).emit('canvas:draw', data)
    }

    function onChatMessageHandler(data)
    {
        statistics.totalChatMessagesSent++;
        data.user = socket.handshake.username;
        io.sockets.in(roomID).emit('chat:message', data)
    }

    function announceNewUser()
    {
        var clients = io.sockets.clients(roomID);
        var users = getRoomClientsData(clients, null);

        io.sockets.in(roomID).emit('remoteUsers:connected', users)

        io.sockets.in(roomID).emit('chat:message', { user: "Server", message: 'Welcome to the chat ' + socket.handshake.username });
    }

    function sendWebRTCData()
    {
        var data =
        {
            token: webRTCBusiness.createToken(sessionID),
            serviceID: webRTCBusiness.getServiceID()
        };

        socket.emit('rtc:initData', data);
    }

    function onDisconnectHandler()
    {
        var clients = io.sockets.clients(roomID);
        var socketID = socket.id;
        var roomToRemove = null

        // the clients list includes the disconnecting user
        if (clients.length > 1)
        {
            var users = getRoomClientsData(clients, socketID);

            var args =
            {
                users: users,
                disconnectUserID: socketID
            }

            io.sockets.in(roomID).emit('remoteUsers:disconnected', args);
        }
        else
        {
            roomToRemove = roomID;
        }

        discardSession(sessionID, socket.handshake.isRegisteredUser, roomToRemove);
        recordTabUsageStatistics();
        recordVoiceChatUsageStatistics();
        recordMapFollowingUsageStatistics();
        saveUsageStatistics();
    }

    function initializeUser()
    {
        announceNewUser();
        sendWebRTCData();

        var clients = io.sockets.clients(roomID);

        if (clients.length <= 1)
        {
            socket.maxUsersInRoom = 1;
            // If the user is the first to join the room, broadcast that its ready straightaway
            socket.emit('room:ready', null);
        }
        else
        {
            var sentUpdate = false;
            var oldestClient = getOldestClient(clients);
            // Retrieve the current state of the canvas and other settings
            oldestClient.emit('room:statusRequest', function(data)
            {
                sentUpdate = true;
                socket.emit('room:statusUpdate', data);
                socket.emit('room:ready', null);
            });

            // Checking if we reached a new amount of max users in this room,
            // for statistics gathering to see about how many people are usually in a room
            if (oldestClient.maxUsersInRoom > clients.length)
            {
                socket.maxUsersInRoom = oldestClient.maxUsersInRoom;
            }
            else
            {
                updateMaxUsersInRoomStatistics(clients, clients.length);
            }

            setTimeout(function()
            {
                // If we didn't get a status update after 25 seconds, send room ready anyway
                // so the client isn't stuck on loading forever (however will be un-synced).
                // It should probably later on try the next oldest client and so on until someone replies
                // with data.
                if (!sentUpdate)
                {
                    socket.emit('room:ready', null);
                }
            }, 25000);
        }
    }

    function saveUsageStatistics()
    {
        var currentTime = new Date();
        var totalDuration = Math.round((currentTime - socket.joinDate) / 1000);

        var parameters =
        {
            startDateTime: socket.joinDate,
            totalDuration: totalDuration,
            drawTabDuration: statistics.secondsSpentOnDrawTab,
            mapTabDuration: statistics.secondsSpentOnMapsTab,
            voiceChatDuration: statistics.secondsSpentInVoiceChat,
            mapFollowFeatureDuration: statistics.secondsSpentInMapFollowFeature,
            chatMessagesSent: statistics.totalChatMessagesSent,
            mapMarkersAdded: statistics.totalMapMarkersAdded,
            registered: statistics.isRegisteredUser,
            maxUsersInRoom: socket.maxUsersInRoom
        }

        statisticPersistence.addStatistic(parameters ,saveStatisticsCallback);

        function saveStatisticsCallback(err)
        {
            if (err)
            {
                console.log("Couldn't save statistics");
                console.log(err);
            }
        }
    }

    function recordTabUsageStatistics()
    {
        var newTabChange = new Date();
        var difference = Math.round((newTabChange - lastTabChange) / 1000);
        lastTabChange = newTabChange;

        if (socket.currentTab === DRAWING_BOARD_TAB_NAME)
        {
            statistics.secondsSpentOnDrawTab += difference;

        }
        else if (socket.currentTab === MAPS_TAB_NAME)
        {
            statistics.secondsSpentOnMapsTab += difference;
        }
    }

    function recordVoiceChatUsageStatistics()
    {
        if (voiceChatActivationDateTime)
        {
            var currentTime = new Date();
            var difference = Math.round((currentTime - voiceChatActivationDateTime) / 1000);
            voiceChatActivationDateTime = null;
            statistics.secondsSpentInVoiceChat += difference;
        }
    }

    function recordMapFollowingUsageStatistics()
    {
        if (mapFollowingActivationDateTime)
        {
            var currentTime = new Date();
            var difference = Math.round((currentTime - mapFollowingActivationDateTime) / 1000);
            mapFollowingActivationDateTime = null;
            statistics.secondsSpentInMapFollowFeature += difference;
        }
    }
}

function getRoomClientsData(clients, excludeID)
{
    var users = [];
    for (var i = 0; i < clients.length; i++)
    {
        if (clients[i].id !== excludeID)
        {
            users.push(
                {
                    id: clients[i].id,
                    username: clients[i].handshake.username,
                    roomName: clients[i].handshake.roomID,
                    picture: clients[i].handshake.picture,
                    isVoiceChatEnabled: clients[i].isVoiceChatEnabled,
                    currentTab: clients[i].currentTab
                });
        }
    }

    return users;
}

function getOldestClient(clients)
{
    var oldestClient = null;
    for (var i = 0; i < clients.length; i++)
    {
        if (!oldestClient)
        {
            oldestClient = clients[i];
        }
        else if (clients[i].joinDate.getTime() < oldestClient.joinDate.getTime())
        {
            oldestClient = clients[i];
        }
    }

    return oldestClient;
}

function updateMaxUsersInRoomStatistics(clients, maxUsersInRoom)
{
    for (var i = 0; i < clients.length; i++)
    {
        clients[i].maxUsersInRoom = maxUsersInRoom;
    }
}

function discardSession(sessionID, isRegisteredUser, roomID)
{
    // Destroy room in DB.
    if (roomID !== null)
    {
        roomPersistence.removeRoomByID(roomID, function(err, result)
        {
            if (err)
            {
                console.log(err)
            }
        });
    }

    // If the user is logged in, we are keeping the session so he/she is still
    // logged in on the front page. Otherwise we discard it.
    if (isRegisteredUser)
    {
        sessionPersistence.updateSessionRoomID(sessionID, 'login', function(err, result)
        {
            if (err)
            {
                console.log(err);
            }
        });
    }
    else
    {
        sessionPersistence.removeSessionByID(sessionID, function(err)
        {
            if (err)
            {
                console.log(err);
                return;
            }

            console.log('Session ' + sessionID + ' has been terminated');
        });
    }
}

function doesClientAlreadyExist(clients, id)
{
    for (var i = 0; i < clients.length; i++)
    {
        if (clients[i].handshake.token === id)
        {
            return true;
        }
    }

    return false;
}