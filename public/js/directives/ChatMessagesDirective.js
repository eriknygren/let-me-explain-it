angularApp.directive('chatmessagesdirective', function(clientStatusService, $window)
{
    return {
        restrict: "A",
        link: function(scope, element)
        {
            var chatMargins = clientStatusService.getMarginsForChat();

            resizeChat();

            scope.$on('chat:message', function(event, args)
            {
                var formattedMessage = "<p class='small-spacing chat-text'><strong>" + args.user + ":</strong> " + args.message + "</p>";
                element[0].innerHTML += formattedMessage;
                scrollChatToBottom();
            });

            angular.element($window).bind('resize', function()
            {
                resizeChat();
            });

            function resizeChat()
            {
                var newChatHeight = $window.innerHeight - chatMargins;

                element.css( 'height' , newChatHeight);
            }

            function scrollChatToBottom()
            {
                element[0].scrollTop = element[0].scrollHeight;
            }
        }
    };
});