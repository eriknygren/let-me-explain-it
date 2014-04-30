var mockUpload = {
    _calledUpload: false,
    _settings: {},
    _progress_callback: function(){},
    _success_callback: function(){},
    _error_callback: function(){},
    upload: function(settings)
    {
        this._settings = settings;

        var _this = this;

        var millisecondsToWait = 500;
        setTimeout(function()
        {
            for (var i = 0.0; i < 1.0; i += 0.1)
            {
                _this._progress_callback({loaded: i});
            }

        }, millisecondsToWait);

        this._calledUpload = true;

        this._success_callback("Success", 201, {Server: "nginx"}, this._settings);
        return this;

    },
    progress: function(callback)
    {
        this._progress_callback = callback;
        return this;
    },
    success: function(callback)
    {
        this._success_callback = callback;
        return this;
    },
    error: function(callback)
    {
        this._error_callback = callback;
        return this;
    }
};