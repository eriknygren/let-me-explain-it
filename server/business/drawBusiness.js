exports.isResizeValid = function(width, height)
{
    if (typeof width === 'string')
    {
        width = parseInt(width);
    }

    if (typeof height === 'string')
    {
        height = parseInt(height);
    }

    if (!isInt(width) || !isInt(height))
    {
        return false;
    }

    if (width < 100 || width > 2000)
    {
        return false;
    }

    if (height < 100 || height > 2000)
    {
        return false;
    }

    return true;
}

function isInt(number)
{
    return typeof number === 'number'  && number !== "" && number % 1 == 0;
}