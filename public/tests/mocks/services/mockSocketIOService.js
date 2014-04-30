var mockSocketIOService = {

    events: {},

    getSocketID: function()
    {
        return "12345";
    },

    on: function(eventName, callback)
    {
        if(!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push(callback);
    },

    emit: function(eventName, data, emitCallback)
    {
        if(this.events[eventName])
        {
            angular.forEach(this.events[eventName], function(callback)
            {

                callback(data);
            });

            if(emitCallback) emitCallback();
        }
    },

    removeAllListeners: function(event)
    {

    },

    removeListener: function(event, eventHandler)
    {

    },

    isConnected: function()
    {
        return true;
    }
};