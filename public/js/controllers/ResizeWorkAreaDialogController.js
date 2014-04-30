/**
 * Created with JetBrains WebStorm.
 * User: Erik
 * Date: 2013-07-25
 * Time: 14:49
 * To change this template use File | Settings | File Templates.
 */
angularApp.controller('ResizeWorkAreaDialogController', ['$scope', 'dialog',
    function($scope, dialog)
    {
        $scope.DEFAULT_DESCRIPTION_TEXT =
            'The default (and recommended) work area size, optimized to work on most screens without any need for scrolling.';
        $scope.OPTIMIZED_DESCRIPTION_TEXT =
            'Work area size optimized for the current size of your browser window.';
        $scope.MANUAL_DESCRIPTION_TEXT =
            'Work area size manually entered in pixels (for advanced users).';

        $scope.onOkClicked = function(selectedOption)
        {
            var result = {};

            if (selectedOption == 'manual')
            {
                result.height = $scope.height;
                result.width = $scope.width;
            }


            result.selectedOption = selectedOption;

            dialog.close(result);
        };

        $scope.onCancelClicked = function()
        {
            dialog.close();
        }

    }])