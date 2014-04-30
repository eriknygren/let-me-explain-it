angularApp.factory('safeApplyService', function()
{
    var safeApplyService = {};

    safeApplyService.apply = function(scope, fn)
    {
        var phase = scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest')
        {
            if (fn)
            {
                scope.$eval(fn);
            }
        }
        else
        {
            if (fn)
            {
                scope.$apply(fn);
            }
            else
            {
                scope.$apply();
            }
        }
    }

    return safeApplyService;
});