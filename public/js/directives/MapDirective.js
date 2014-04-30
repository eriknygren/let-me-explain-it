/**
 * Created with JetBrains WebStorm.
 * User: Erik
 * Date: 2013-07-30
 * Time: 15:50
 * To change this template use File | Settings | File Templates.
 */
angularApp.directive('map', function($window, $timeout, socketIOService, $dialog)
{
    return {
        restrict: 'E',
        replace: true,
        template: '<div></div>',
        link: function(scope, element, attrs)
        {
            var map = null;
            var statusChanged = false;
            var isFollowing = false;
            var userToFollowID;
            var updateTimer;
            var cachedMarkers = [];

            var editMarkerDialogOptions = {
                backdrop: false,
                keyboard: true,
                backdropClick: true,
                templateUrl:  '../modals/prompt',
                controller: 'PromptModalController'
            };

            function initializeMap()
            {
                var myOptions = {
                    zoom: 6,
                    center: new google.maps.LatLng(46.87916, -3.32910),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    streetViewControl: false
                };

                map = new google.maps.Map(document.getElementById(attrs.id), myOptions);

                initializeMapEvents();
            }

            // Work around for running things after DOM is fully rendered..
            // Thanks to http://blog.brunoscopelliti.com/run-a-directive-after-the-dom-has-finished-rendering
            $timeout(initializeMap, 0);

            function initializeMapEvents()
            {
                scope.$on('map:statusUpdate', function(event, args)
                {
                    for (var i = 0; i < args.markers.length; i++)
                    {
                        addMarkerHandler(args.markers[i]);
                    }

                });

                socketIOService.on('map:markerAdd', addMarkerHandler);
                socketIOService.on('map:markerRemove', removeCachedMarker);
                socketIOService.on('map:markerTitleEdit', editCachedMarkerTitle);

                google.maps.event.addListener(map, 'click', function(e)
                {
                    var args =
                    {
                        latitude: e.latLng.lat(),
                        longitude: e.latLng.lng(),
                        title:"Left click to edit this text, right click to remove me."
                    }
                    socketIOService.emit('map:markerAdd', args);
                    addMarkerHandler(args);
                });

                function addMarkerHandler(args)
                {
                    cachedMarkers.push(args);
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(args.latitude, args.longitude),
                        title: args.title
                    });

                    marker.setMap(map);

                    socketIOService.on('map:markerRemove', removeMarkerFromMapHandler);
                    socketIOService.on('map:markerTitleEdit', editMarkerTitleHandler);

                    google.maps.event.addListener(marker, "click", function()
                    {
                        editMarkerDialogOptions.resolve =
                        {
                            title: function()
                            {
                                return 'Edit Marker Title';
                            },
                            inputText: function()
                            {
                                return marker.title;
                            }
                        }

                        var promptDialog = $dialog.dialog(editMarkerDialogOptions);
                        promptDialog.open().then(function(result)
                        {
                            if (typeof result === 'undefined')
                            {
                                return;
                            }

                            var oldTitle = marker.title;
                            marker.setTitle(result);

                            var args =
                            {
                                latitude: marker.position.lat(),
                                longitude: marker.position.lng(),
                                title: marker.title,
                                oldTitle: oldTitle
                            }

                            socketIOService.emit('map:markerTitleEdit', args);
                            editCachedMarkerTitle(args);
                        });
                    });

                    google.maps.event.addListener(marker, "rightclick", function()
                    {

                        var args =
                        {
                            latitude: marker.position.lat(),
                            longitude: marker.position.lng(),
                            title: marker.title
                        }

                        socketIOService.emit('map:markerRemove', args);
                        removeMarkerFromMapHandler(args);
                        removeCachedMarker(args);
                    });

                    function editMarkerTitleHandler(args)
                    {
                        if (marker == null)
                        {
                            return;
                        }

                        if (marker.position.lat() === args.latitude && marker.position.lng() == args.longitude
                            && marker.title === args.oldTitle)
                        {
                            marker.setTitle(args.title);
                        }
                    }

                    function removeMarkerFromMapHandler(args)
                    {
                        // We can only remove a marker if we have a reference to the marker object, that's why
                        // there are two separate remove marker handlers
                        if (marker == null)
                        {
                            return;
                        }

                        if (marker.position.lat() === args.latitude && marker.position.lng() == args.longitude)
                        {
                            socketIOService.removeListener('map:markerRemove', removeMarkerFromMapHandler);
                            socketIOService.removeListener('map:markerTitleEdit', editMarkerTitleHandler);
                            google.maps.event.clearListeners(marker, "click");
                            google.maps.event.clearListeners(marker, "rightclick");
                            marker.setMap(null);
                            marker = null;
                        }
                    }
                }
                google.maps.event.addListener(map, 'bounds_changed', function()
                {
                    statusChanged = true;
                });

                google.maps.event.addListener(map, 'maptypeid_changed', function()
                {
                    statusChanged = true;
                });
            }

            function removeCachedMarker(marker)
            {
                for (var i = 0; i < cachedMarkers.length; i++)
                {
                    var tempMarker = cachedMarkers[i];

                    // Just comparing marker === tempMarker doesn't work
                    if(marker.title === tempMarker.title &&
                        marker.latitude === tempMarker.latitude &&
                        marker.longitude === tempMarker.longitude)
                    {
                        cachedMarkers.splice(i, 1);
                        break;
                    }
                }
            }

            function editCachedMarkerTitle(marker)
            {
                for (var i = 0; i < cachedMarkers.length; i++)
                {
                    var tempMarker = cachedMarkers[i];

                    if(marker.oldTitle === tempMarker.title &&
                        marker.latitude === tempMarker.latitude &&
                        marker.longitude === tempMarker.longitude)
                    {
                        cachedMarkers[i].title = marker.title;
                        break;
                    }
                }
            }

            function startUpdateTimer()
            {
                updateTimer = $timeout(function()
                {
                    emitMapStatusUpdates();
                    startUpdateTimer();
                }, 300);
            }

            function emitMapStatusUpdates()
            {
                if (statusChanged)
                {
                    var coordinates = map.getCenter();
                    var mapStatus =
                    {
                        latitude: coordinates.lat(),
                        longitude: coordinates.lng(),
                        zoomLevel: map.getZoom()
                    }

                    if (!isFollowing)
                    {
                        socketIOService.emit('map:positionUpdate', mapStatus);
                        console.log(mapStatus);
                    }

                    statusChanged = false;
                }
            }

            var mapFollowingListener = scope.$on('map:following', function(event, args)
            {
                userToFollowID = args.followUser;
                isFollowing = args.isFollowing;
                socketIOService.emit('map:following', args);

                console.log(args.isFollowing);
            });

            var tabChangeListener = scope.$on('tab:change', function(event, args)
            {
                if (args === 'Maps')
                {
                    // Won't throw any exceptions if its not initiated,
                    // so cancelling once before just to be safe.
                    $timeout.cancel(updateTimer);

                    startUpdateTimer();

                    if (map)
                    {
                        google.maps.event.trigger(map, "resize");
                    }
                }
                else
                {
                    $timeout.cancel(updateTimer);
                }
            });

            socketIOService.on('map:positionUpdate', function(data)
            {
                if (isFollowing && data.userID === userToFollowID)
                {
                    var panTo = new google.maps.LatLng(data.latitude, data.longitude);
                    console.log(data);
                    map.panTo(panTo);
                    map.setZoom(data.zoomLevel);
                }
            });

            scope.$on('map:statusRequest', function(event, callback)
            {
                var result =
                {
                    markers: cachedMarkers
                }

                return callback(result);
            });

            scope.$on("$destroy", function()
            {
                socketIOService.removeAllListeners('map:positionUpdate');
                socketIOService.removeAllListeners('map:statusUpdate');
                socketIOService.removeAllListeners('map:markerAdd');
                socketIOService.removeAllListeners('map:markerRemove');
                socketIOService.removeAllListeners('map:markerTitleEdit');
                mapFollowingListener();
                tabChangeListener();
            })
        }
    }
});