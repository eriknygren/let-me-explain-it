/**
 * Created with JetBrains WebStorm.
 * User: Erik
 * Date: 2013-07-25
 * Time: 19:18
 * To change this template use File | Settings | File Templates.
 */
angularApp.directive('numericinputonlydirective', function()
{
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl)
        {
            function fromUser(text)
            {
                // filters all non numeric input
                var transformedInput = text.replace(/[^0-9]/g, '');

                if (transformedInput !== text)
                {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;  // or return Number(transformedInput)
            }

            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});