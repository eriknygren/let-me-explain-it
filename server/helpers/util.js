exports.isNullOrUndefined = function(value)
{
    if (typeof value === 'undefined')
    {
        return true;
    }

    if (value == null)
    {
        return true;
    }

    return false;
};