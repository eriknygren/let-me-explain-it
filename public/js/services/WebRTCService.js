angularApp.factory('webRTCService', function($rootScope, safeApplyService, $location, socketIOService)
{
    var webRTCService = {};
    var isVoiceChatEnabled = false;
    var client = null;
    var vlineSession = null;
    var authToken;
    var serviceId = "";
    var profile;

    socketIOService.on('rtc:initData', function(data)
    {
        console.log(data);
        authToken = data.token;
        serviceId = data.serviceID;
        init();

    });

    function init()
    {
        if (client != null)
        {
            if (client.isLoggedIn())
            {
                return;
            }
        }
        var socketID = socketIOService.getSocketID();
        profile = {"username": socketID, "id": socketID};

        // Create vLine client
        window.vlineClient = client = vline.Client.create({"serviceId": serviceId, "ui": false});
        // Add login event handler
        client.on('login', onLogin);
        client.on('logout', onLogout)

        client.on('add:mediaSession', onMediaSession, this);

        // Do login
        client.login(serviceId, profile, authToken);
    }

    function onLogout(event)
    {
        console.log('logged out');
    }

    function onLogin(event)
    {
        vlineSession = event.target;
        console.log(vlineSession.getLocalPersonId());
    }

    function onMediaSession(e)
    {
        var mediaSession = e.target;

        mediaSession.on('enterState:incoming', onIncomingMedia);
        mediaSession.on('enterState:closed', function(e)
        {
            console.log('closed media session');
            rtcEnabledStatusListener();
            socketDisconnectListener();
        });

        mediaSession.on('mediaSession:addRemoteStream', function(event)
        {
            var stream = event.stream;
            var person = stream.getPerson();
            var id = person.getUsername();

            // create audio element
            var audio = stream.createMediaElement();
            audio.volume = 0.5

            var volumeChangeListener =  $rootScope.$on('rtc:volumeChange', function(event, args)
            {
                if (args.id == id)
                {
                    console.log('VOLUME CHANGED')
                    audio.volume = args.volume / 100;
                    console.log('changed' + args.id + "'s volume to: " + args.volume / 100);
                }
            });
        });

        var rtcEnabledStatusListener = $rootScope.$on('rtc:enabledStatusChange', function(event, newValue)
        {
            if (!newValue)
            {
                if (!mediaSession.isClosed())
                {
                    mediaSession.stop();
                }
            }
        });

        var socketDisconnectListener = $rootScope.$on('socket:disconnect', function(event, args)
        {
            if (!mediaSession.isClosed())
            {
                mediaSession.stop();
            }
        });
    }

    // Auto-accept incoming call
    function onIncomingMedia(e)
    {
        console.log('Accepting call..');
        var mediaSession = e.target;
        mediaSession.start({video: false, audio: true});
    }

    // If someone in the room enables RTC, call him/her up.
    socketIOService.on('rtc:enabled', function(data)
    {
        if (isVoiceChatEnabled && vlineSession != null)
        {
            vlineSession.getPerson(data.rtcID).done(function(person)
            {
                console.log('calling ' + data.rtcID);

                person.startMedia({video: false, audio: true});
            });
        }
    });

    $rootScope.$on('rtc:enabledStatusChange', function(event, newValue)
    {
        isVoiceChatEnabled = newValue;
    });

    webRTCService.getID = function()
    {
        if (!vlineSession)
        {
            return null;
        }

        return vlineSession.getLocalPersonId();
    }

    webRTCService.getServiceID = function()
    {
        return serviceId;
    }

    webRTCService.isLoggedIn = function()
    {
        if (client != null)
        {
            return client.isLoggedIn();
        }

        return false;
    }

    return webRTCService;
});