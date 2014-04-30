angularApp.directive('drawdirective', function(angularBroadcastService, socketIOService, $window, clientStatusService)
{
    return {
        restrict: "A",
        link: function(scope, element)
        {
            var context = element[0].getContext('2d');
            context.webkitImageSmoothingEnabled = false;
            context.mozImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;

            var drawing = false;
            // the last coordinates before the current move
            var lastX;
            var lastY;
            var strokeColor;

            element.bind('mousedown', function(event)
            {
                event.preventDefault();
                event.stopPropagation();

                var currentCoordinates = getOffSetCoordinates(event);

                var currentX = currentCoordinates.x;
                var currentY = currentCoordinates.y;

                lastX = currentX;
                lastY = currentY;
                // begins new line
                context.beginPath();
                drawing = true;
            });

            element.bind('mousemove', function(event)
            {
                if (drawing)
                {
                    var currentCoordinates = getOffSetCoordinates(event);

                    var currentX = currentCoordinates.x;
                    var currentY = currentCoordinates.y;

                    draw(lastX, lastY, currentX, currentY, strokeColor, true);

                    // set current coordinates to last one
                    lastX = currentX;
                    lastY = currentY;
                }
            });

            element.bind('mouseup', function(event)
            {
                // stop drawing
                drawing = false;
            });

            element.bind('mouseout', function(event)
            {
                // stop drawing
                drawing = false;
                lastX = null;
                lastY = null;
            });

            function draw(lX, lY, cX, cY, color, localDraw)
            {
                context.beginPath();

                // line from
                context.moveTo(lX, lY);
                // to
                context.lineTo(cX, cY);
                // color
                context.strokeStyle = color;
                // draw it
                context.stroke();

                if (localDraw)
                {
                    var data = {lastX: lX, lastY: lY, currentX: cX, currentY: cY, strokeColor: color};

                    socketIOService.emit('canvas:draw', data)
                }
            }

            socketIOService.on('canvas:draw', function(data)
            {
                draw(data.lastX, data.lastY, data.currentX, data.currentY, data.strokeColor, false);
            });

            scope.$on('requestWorkAreaResize', function(event, args)
            {
                switch(args.selectedOption)
                {
                    case 'default':
                        var defaultDimensions = clientStatusService.getDefaultCanvasSize();
                        requestCanvasResize(defaultDimensions.width, defaultDimensions.height);
                        break;
                    case 'optimized':
                        var optimalDimensions = clientStatusService.getOptimalCanvasSize();
                        requestCanvasResize(optimalDimensions.width, optimalDimensions.height);
                        break;
                    case 'manual':
                        requestCanvasResize(args.width, args.height);
                        break;
                }
            });

            scope.$on('canvas:brushColor', function(event, args)
            {
                strokeColor = args;
            });

            function requestCanvasResize(width, height)
            {
                var args = {};

                args.width = width;
                args.height = height;

                socketIOService.emit('canvas:resize', args);
            }

            socketIOService.on('canvas:resize', function(data)
            {
                resizeCanvas(data.width, data.height);
            });

            socketIOService.on('canvas:reset', function(data)
            {
                resetCanvas();
            });

            function resizeCanvas(width, height)
            {
                var imageData = context.getImageData(0, 0, context.canvas.width - 1, context.canvas.height - 1);

                context.canvas.width = width;
                context.canvas.height = height;
                context.putImageData(imageData, 0, 0);
            }

            scope.$on('canvas:statusRequest', function(event, callback)
            {
                var result =
                {
                    imageData: context.canvas.toDataURL(),
                    width: context.canvas.width,
                    height: context.canvas.height
                }

                return callback(result);
            });

            scope.$on('canvas:statusUpdate', function(event, args)
            {
                var image = new Image();

                image.height = args.height;
                image.width = args.width;
                image.onload = function ()
                {
                    context.canvas.width = args.width;
                    context.canvas.height = args.height;
                    context.drawImage(image, 0, 0);
                };

                image.src = args.imageData;
            });

            function resetCanvas()
            {
                // Thanks http://stackoverflow.com/a/6722031
                // Store the current transformation matrix
                context.save();

                // Use the identity matrix while clearing the canvas
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);

                // Restore the transform
                context.restore();
            }

            function getOffSetCoordinates(event)
            {
                var x;
                var y;

                if (!event.offsetX)
                {
                    x = event.pageX - element.offset().left;
                    y = event.pageY - element.offset().top;
                }
                else
                {
                    x = event.offsetX;
                    y = event.offsetY;
                }

                return {x: x, y: y};
            }

            scope.$on("$destroy", function()
            {
                socketIOService.removeAllListeners('canvas:draw');
                socketIOService.removeAllListeners('canvas:reset');
                socketIOService.removeAllListeners('canvas:resize');
            })
        }
    };
});