angularApp.directive('chatmessagesdirective', function(clientStatusService, $window)
{
    return {
        restrict: "A",
        link: function(scope, element)
        {
            var chatMargins = clientStatusService.getMarginsForChat();
            var navBarHeight = clientStatusService.getNavBarHeight();

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
                var newChatHeight;

                if ($window.innerWidth >= 960)
                {
                    newChatHeight = $window.innerHeight - chatMargins;
                }
                else
                {
                    newChatHeight = $window.innerHeight - chatMargins - navBarHeight;
                }

                element.css( 'height' , newChatHeight);
            }

            function scrollChatToBottom()
            {
                element[0].scrollTop = element[0].scrollHeight;
            }
        }
    };
});