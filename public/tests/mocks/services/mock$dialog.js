mock$dialog =
{
    createdDialogInstance: false,
    _options: {},
    dialog: function(options)
    {
        this._options = options;

        this.createdDialogInstance = true;

        var mockDialogInstance =
        {
            open: function(){
                return {

                    _then_callback: function(){},
                    then: function(callback)
                    {
                        this._then_callback = callback;
                        return this;
                    }
                }
            }

        };

       return mockDialogInstance;
    }
};