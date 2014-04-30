/*!03-02-2014 */
function isBrowserCompatible(){return"function"!=typeof document.createElement("canvas").getContext?!1:"function"!=typeof WebSocket?!1:!0}var angularApp=angular.module("angularApp",["ui.bootstrap","colorpicker.module","angularFileUpload"]);angularApp.config(["$routeProvider","$locationProvider",function(a,b){b.html5Mode(!0),a.when("/",{templateUrl:"/partials/login"}),a.when("/room/:roomName",{templateUrl:"/partials/room"}),a.when("/notSupported",{templateUrl:"/partials/notSupported"}),a.otherwise({redirectTo:"/"})}]).run(["$rootScope","$location",function(a,b){a.$on("$routeChangeStart",function(c,d){return isBrowserCompatible()?void("/partials/room"===d.templateUrl?(a.$broadcast("title:show",null),a.$broadcast("socket:connect",null)):"/partials/room"!==d.templateUrl&&(a.$broadcast("title:hide",null),a.$broadcast("socket:disconnect",null))):void b.path("/notSupported")})}]),angularApp.controller("ChatController",["$scope","socketIOService","safeApplyService","angularBroadcastService",function(a,b,c,d){console.log("ChatController Loaded"),a.messages=[],a.chatMessage="",b.on("chat:message",function(a){console.log("New message"),d.broadCast("chat:message",a)}),a.sendMessage=function(){if(a.chatMessage&&""!==a.chatMessage){var c={user:"Mr Client",message:a.chatMessage};b.emit("chat:message",c),a.chatMessage=""}},a.$on("$destroy",function(){b.removeAllListeners("chat:message")})}]),angularApp.controller("ForgotPasswordController",["$scope","$http","dialog","clientStatusService",function(a,b,c){function d(b){a.successText=b,a.showSuccessText=!0,a.showErrorText=!1}function e(b){a.errorText=b,a.showErrorText=!0,a.showSuccessText=!1}a.showErrorText=!1,a.showSuccessText=!1,a.canClickResetPassword=!0,a.resetPassword=function(){if(a.canClickResetPassword=!1,!a.email||""===a.email)return void e("Please fill in all fields");var c={email:a.email};b({method:"POST",url:"/api/resetUserPassword",data:c}).success(function(b){a.canClickResetPassword=!0,d(b)}).error(function(b){a.canClickResetPassword=!0,e(b)})},a.onCloseClicked=function(){c.close()}}]),angularApp.controller("HeaderBarController",["$scope","$location","clientStatusService",function(a,b){a.title="",a.$on("title:show",function(){var c=b.path();console.log(c);var d=c.split("/");a.title=d[d.length-1]}),a.$on("title:hide",function(){a.title=""})}]),angularApp.controller("InfoModalController",["$scope","dialog","title","content","easyCopyContent",function(a,b,c,d,e){a.title=c,a.content=d,a.showEasyCopyContent=!1,a.easyCopyContent="","undefined"!=typeof e&&""!==e&&(a.easyCopyContent=e,a.showEasyCopyContent=!0),a.close=function(){b.close()}}]),angularApp.controller("LocalUserController",["$scope","angularBroadcastService","webRTCService","socketIOService","$dialog","clientStatusService",function(a,b,c,d,e,f){a.isVoiceChatEnabled=!1,a.isWebRTCSupported=null!==c,a.username="",a.picture="";var g={backdrop:!0,keyboard:!0,backdropClick:!1,templateUrl:"../modals/userSettings",controller:"UserSettingsController"};if(a.showLocalUserOptions=function(){var b=e.dialog(g);b.open().then(function(){var b=f.getUserData();a.username=b.username})},a.isWebRTCSupported){var h=a.$watch("isVoiceChatEnabled",function(e){b.broadCast("rtc:enabledStatusChange",a.isVoiceChatEnabled);var f={socketID:d.getSocketID(),rtcID:c.getID()};e?d.emit("rtc:enabled",f):d.emit("rtc:disabled",f)}),i=a.$on("localUser:update",function(b,c){a.username=c.username,a.picture=c.picture});a.$on("$destroy",function(){i(),h()})}}]),angularApp.controller("LoginController",["$scope","$dialog","$http","$location","clientStatusService","cookieService",function(a,b,c,d,e,f){function g(){var b=f.readCookie("token");if("undefined"!=typeof b){var d={token:b};c({method:"POST",url:"/api/getUser",data:d}).success(function(b){e.setUserData(b.name,b.email,b.picture,!0),a.user={username:b.name,email:b.email},a.isLoggedIn=!0,a.isLoaded=!0}).error(function(b){console.log(b),a.isLoaded=!0})}else a.isLoaded=!0}function h(b){a.registrationErrorText=b,a.registerPassword="",a.showRegistrationErrorText=!0}function i(b){a.roomJoinErrorText=b,a.showroomJoinErrorText=!0}function j(b){a.loginErrorText=b,a.showLoginErrorText=!0}a.isLoaded=!1,a.isLoggedIn=!1,a.isCollapsed=!0,a.isRegistrationInfoTextCollapsed=!0,a.rememberUser=!1,a.user={},a.collapseLoginForm=!0,a.roomJoinOptions="join",a.registrationErrorText="",a.roomJoinErrorText="",a.showRegistrationErrorText=!1,a.showroomJoinErrorText=!1,a.showLoginErrorText=!1,a.canClickJoin=!0,a.canClickRegister=!0,a.canClickLogin=!0,a.canClickLogout=!0,a.canClickForgotPassword=!0;var k={backdrop:!0,keyboard:!0,backdropClick:!1,templateUrl:"../modals/userSettings",controller:"UserSettingsController"},l={backdrop:!1,keyboard:!0,backdropClick:!0,templateUrl:"../modals/forgotPassword",controller:"ForgotPasswordController"};g(),a.onUserSettingsClicked=function(){var c=b.dialog(k);c.open().then(function(){var b=e.getUserData();a.user={username:b.username,email:b.email}})},a.onForgotPasswordClicked=function(){var a=b.dialog(l);a.open()},a.onLoginClicked=function(){if(!a.username||""===a.username||!a.password||""===a.password)return void j("Please fill in all fields");a.canClickLogin=!1;var b={username:a.username,password:a.password,remember:a.rememberUser};c({method:"POST",url:"/api/login",data:b}).success(function(b){a.canClickLogin=!0,e.setUserData(b.name,b.email,b.picture,!0),a.user={username:b.name,email:b.email},a.showLoginErrorText=!1,a.isLoggedIn=!0}).error(function(b){a.canClickLogin=!0,j(b)})},a.onLogoutClicked=function(){a.canClickLogout=!1,c({method:"POST",url:"/api/logout"}).success(function(){a.canClickLogout=!0,e.setUserData("","","",!1),a.isLoggedIn=!1}).error(function(b){a.canClickLogout=!0,console.log(b)})},a.joinRoom=function(){var b=a.roomName;a.canClickJoin=!1;var e="create"===a.roomJoinOptions,f={roomName:b,createNewRoom:e};c({method:"POST",url:"/api/joinRoom",data:f}).success(function(){a.canClickJoin=!0,a.showroomJoinErrorText=!1,d.path("/room/"+b.toLowerCase())}).error(function(b){i(b),a.canClickJoin=!0})},a.registerUser=function(){var b=a.registerUsername,d=a.registerEmail,f=a.registerPassword;if(!d||""===d||!b||""===b||!f||""===f)return void h("Please fill in all fields");a.canClickRegister=!1;var g={username:b,email:d,password:f};c({method:"POST",url:"/api/registerUser",data:g}).success(function(b){a.canClickRegister=!0,e.setUserData(b.name,b.email,b.picture,!0),a.user={username:b.name,email:b.email},a.showRegistrationErrorText=!1,a.isLoggedIn=!0}).error(function(b){a.canClickRegister=!0,h(b)})}}]),angularApp.controller("MainRoomController",["$scope","socketIOService","safeApplyService","clientStatusService",function(a,b,c,d){a.isLoaded=!1,d.checkLoginStatus(),b.on("room:ready",function(){a.isLoaded=!0}),b.on("room:statusRequest",function(a){d.getRoomStatus(function(b){return a(b)})}),b.on("room:statusUpdate",function(a){d.broadCastRoomStatusUpdate(a)}),a.$on("$destroy",function(){b.removeAllListeners("room:statusRequest"),b.removeAllListeners("room:statusUpdate"),b.removeAllListeners("client:sessionID")})}]),angularApp.controller("PromptModalController",["$scope","dialog","title","inputText",function(a,b,c,d){a.title=c,a.inputText=d,a.save=function(){b.close(a.inputText)},a.cancel=function(){b.close()}}]),angularApp.controller("RemoteUsersController",["$scope","angularBroadcastService","socketIOService","safeApplyService",function(a,b,c,d){function e(b,c){for(var e=0;e<a.remoteUsers.length;e++)if(console.log(a.remoteUsers[e]),a.remoteUsers[e].id===b){a.remoteUsers[e].currentTab=c,d.apply(a,a.remoteUsers[e].isVoiceChatEnabled);break}}function f(b,c){for(var e=0;e<a.remoteUsers.length;e++)if(console.log(a.remoteUsers[e]),a.remoteUsers[e].id===b){a.remoteUsers[e].isVoiceChatEnabled=c,d.apply(a,a.remoteUsers[e].isVoiceChatEnabled);break}}function g(e){for(var f=c.getSocketID(),g=e.length,h=0;g>h;h++)if(e[h].id===f){b.broadCast("localUser:update",e[h]),e.splice(h,1);break}a.remoteUsers=e,d.apply(a,a.remoteUsers),b.broadCast("remoteUsers:update",e)}a.remoteUsers=[],a.isVoiceChatEnabled,c.on("remoteUsers:connected",function(a){console.log("User connecting"),g(a)}),c.on("remoteUsers:disconnected",function(a){console.log("User disconnecting"),b.broadCast("remoteUser:disconnect",a.disconnectUserID),g(a.users)}),c.on("rtc:enabled",function(a){f(a.socketID,!0)}),c.on("rtc:disabled",function(a){f(a.socketID,!1)}),c.on("tab:change",function(a){e(a.socketID,a.newValue)}),a.onVolumeChange=function(a,c){var d={id:a,volume:c};b.broadCast("rtc:volumeChange",d)};var h=a.$on("rtc:enabledStatusChange",function(b,c){a.isVoiceChatEnabled=c,d.apply(a,a.isVoiceChatEnabled)});a.$on("$destroy",function(){h(),c.removeAllListeners("rtc:enabled"),c.removeAllListeners("rtc:disabled"),c.removeAllListeners("remoteUsers:connected"),c.removeAllListeners("remoteUsers:disconnected")})}]),angularApp.controller("ResizeWorkAreaDialogController",["$scope","dialog",function(a,b){a.DEFAULT_DESCRIPTION_TEXT="The default (and recommended) work area size, optimized to work on most screens without any need for scrolling.",a.OPTIMIZED_DESCRIPTION_TEXT="Work area size optimized for the current size of your browser window.",a.MANUAL_DESCRIPTION_TEXT="Work area size manually entered in pixels (for advanced users).",a.onOkClicked=function(c){var d={};"manual"==c&&(d.height=a.height,d.width=a.width),d.selectedOption=c,b.close(d)},a.onCancelClicked=function(){b.close()}}]),angularApp.controller("TabController",["$scope","angularBroadcastService","socketIOService",function(a,b,c){a.tabSelected=function(a){var d={socketID:c.getSocketID(),newValue:a};b.broadCast("tab:change",a),c.emit("tab:change",d)}}]),angularApp.controller("ToolbarController",["$scope","$dialog","$window","socketIOService","angularBroadcastService",function(a,b,c,d,e){function f(a,b){var c={};c.isFollowing=a,c.followUser=b,e.broadCast("map:following",c)}a.remoteUsers=[],a.isFollowing=!1,a.activeTab="Drawing Board",a.brushColor="#4bf";var g="Copy the link below and send it to your attendees",h=c.location.href,i={backdrop:!0,keyboard:!0,backdropClick:!1,templateUrl:"../modals/resizeWorkAreaDialog",controller:"ResizeWorkAreaDialogController"},j={backdrop:!0,keyboard:!0,backdropClick:!0,templateUrl:"../modals/yesNo",controller:"YesNoModalController",resolve:{title:function(){return"Confirm Reset Drawing Board"},content:function(){return"This will reset the drawing board to blank, continue?"}}},k={backdrop:!1,keyboard:!0,backdropClick:!0,templateUrl:"../modals/info",controller:"InfoModalController",resolve:{title:function(){return"Invite Friends"},content:function(){return g},easyCopyContent:function(){return h}}};a.$on("tab:change",function(b,c){a.activeTab=c}),a.onInviteFriendsClicked=function(){var a=b.dialog(k);a.open()},a.onResizeClicked=function(){var a=b.dialog(i);a.open().then(function(a){a&&e.broadCast("requestWorkAreaResize",a)})},a.onResetClicked=function(){var a=b.dialog(j);a.open().then(function(a){a&&d.emit("canvas:reset",null)})},a.followUser=function(b){a.isFollowing=!0,f(!0,b)},a.$watch("isFollowing",function(a){a||f(!1,null)}),a.$watch("brushColor",function(a){e.broadCast("canvas:brushColor",a)}),a.$on("remoteUsers:update",function(b,c){a.remoteUsers=c})}]),angularApp.controller("UserSettingsController",["$scope","$upload","$http","dialog","clientStatusService",function(a,b,c,d,e){function f(){a.oldPassword="",a.password="",a.password2=""}function g(b){a.successText=b,a.showSuccessText=!0,a.showErrorText=!1}function h(b){a.errorText=b,a.showErrorText=!0,a.showSuccessText=!1}a.DEFAULT_VIEW="0",a.PASSWORD_VIEW="1",a.PICTURE_VIEW="2",a.CURRENT_VIEW=a.DEFAULT_VIEW,a.showErrorText=!1,a.showSuccessText=!1,a.showUploadProgressText=!1,a.uploadProgress=0;var i=e.getUserData();a.isLoggedIn=i.isLoggedIn,a.username=i.username,a.email=i.email,a.picture=i.picture,a.canClickChangeDetails=!0,a.canClickChangePassword=!0,a.canClickEditPicture=!0;var j;a.changeView=function(b){a.showErrorText=!1,a.showSuccessText=!1,a.CURRENT_VIEW=b},a.editUserSettings=function(){if(a.canClickChangeDetails=!1,!a.email||""===a.email||!a.username||""===a.username)return void h("Please fill in all fields");var b={username:a.username,email:a.email};c({method:"POST",url:"/api/editUserDetails",data:b}).success(function(b){a.canClickChangeDetails=!0,console.log(b),e.setUserData(b.name,b.email,null,!0),a.username=b.name,a.email=b.email,g("Details successfully altered")}).error(function(b){a.canClickChangeDetails=!0,h(b)})},a.editUserPassword=function(){if(a.canClickChangePassword=!1,!a.oldPassword||""===a.oldPassword||!a.password||""===a.password||!a.password2||""===a.password2)return void h("Please fill in all fields");if(a.password!==a.password2)return void h("New passwords do not match");var b={oldPassword:a.oldPassword,password:a.password,password2:a.password2};c({method:"POST",url:"/api/editUserPassword",data:b}).success(function(b){a.canClickChangePassword=!0,g(b),f()}).error(function(b){a.canClickChangePassword=!0,h(b)})},a.deleteUserPicture=function(){a.canClickEditPicture=!1,c({method:"POST",url:"/api/deleteUserPicture"}).success(function(b){a.canClickEditPicture=!0,a.picture=b,g("Picture successfully removed")}).error(function(b){a.canClickEditPicture=!0,h(b)})},a.editUserPicture=function(){var c="Please select an image";return a.canClickEditPicture=!1,"undefined"==typeof j?(a.canClickEditPicture=!0,void h(c)):j?"undefined"==typeof j.type?(a.canClickEditPicture=!0,void h(c)):"image/"!==j.type.substring(0,6)?(a.canClickEditPicture=!0,void h(c)):j.size>3145728?(a.canClickEditPicture=!0,void h("Image needs to be smaller than 3mb")):(a.showUploadProgressText=!0,void(a.upload=b.upload({url:"/api/editUserPicture",method:"POST",file:j}).progress(function(b){a.uploadProgress=parseInt(100*b.loaded/b.total)}).success(function(b){a.canClickEditPicture=!0,a.showUploadProgressText=!1,a.picture=b+"#"+(new Date).getTime(),g("Picture successfully changed")}).error(function(b){a.canClickEditPicture=!0,a.showUploadProgressText=!1,h(b)}))):(a.canClickEditPicture=!0,void h(c))},a.onUploadFileChanged=function(a){j=a[0]},a.onCloseClicked=function(){d.close()}}]),angularApp.controller("YesNoModalController",["$scope","dialog","title","content",function(a,b,c,d){a.title=c,a.content=d,a.confirm=function(){b.close(!0)},a.cancel=function(){b.close(!1)}}]),angularApp.directive("chatmessagesdirective",["clientStatusService","$window",function(a,b){return{restrict:"A",link:function(c,d){function e(){var a=b.innerHeight-g;d.css("height",a)}function f(){d[0].scrollTop=d[0].scrollHeight}var g=a.getMarginsForChat();e(),c.$on("chat:message",function(a,b){var c="<p class='small-spacing chat-text'><strong>"+b.user+":</strong> "+b.message+"</p>";d[0].innerHTML+=c,f()}),angular.element(b).bind("resize",function(){e()})}}}]),angularApp.directive("colorpickericondirective",["angularBroadcastService",function(){return{restrict:"A",link:function(a,b,c){a.$watch(c.model,function(a){b.css("background-color",a)})}}}]),angularApp.directive("drawdirective",["angularBroadcastService","socketIOService","$window","clientStatusService",function(a,b,c,d){return{restrict:"A",link:function(a,c){function e(a,c,d,e,f,g){if(j.beginPath(),j.moveTo(a,c),j.lineTo(d,e),j.strokeStyle=f,j.stroke(),g){var h={lastX:a,lastY:c,currentX:d,currentY:e,strokeColor:f};b.emit("canvas:draw",h)}}function f(a,c){var d={};d.width=a,d.height=c,b.emit("canvas:resize",d)}function g(a,b){var c=j.getImageData(0,0,j.canvas.width-1,j.canvas.height-1);j.canvas.width=a,j.canvas.height=b,j.putImageData(c,0,0)}function h(){j.save(),j.setTransform(1,0,0,1,0,0),j.clearRect(0,0,j.canvas.width,j.canvas.height),j.restore()}function i(a){var b,d;return a.offsetX?(b=a.offsetX,d=a.offsetY):(b=a.pageX-c.offset().left,d=a.pageY-c.offset().top),{x:b,y:d}}var j=c[0].getContext("2d");j.webkitImageSmoothingEnabled=!1,j.mozImageSmoothingEnabled=!1,j.imageSmoothingEnabled=!1;var k,l,m,n=!1;c.bind("mousedown",function(a){a.preventDefault(),a.stopPropagation();var b=i(a),c=b.x,d=b.y;k=c,l=d,j.beginPath(),n=!0}),c.bind("mousemove",function(a){if(n){var b=i(a),c=b.x,d=b.y;e(k,l,c,d,m,!0),k=c,l=d}}),c.bind("mouseup",function(){n=!1}),c.bind("mouseout",function(){n=!1,k=null,l=null}),b.on("canvas:draw",function(a){e(a.lastX,a.lastY,a.currentX,a.currentY,a.strokeColor,!1)}),a.$on("requestWorkAreaResize",function(a,b){switch(b.selectedOption){case"default":var c=d.getDefaultCanvasSize();f(c.width,c.height);break;case"optimized":var e=d.getOptimalCanvasSize();f(e.width,e.height);break;case"manual":f(b.width,b.height)}}),a.$on("canvas:brushColor",function(a,b){m=b}),b.on("canvas:resize",function(a){g(a.width,a.height)}),b.on("canvas:reset",function(){h()}),a.$on("canvas:statusRequest",function(a,b){var c={imageData:j.canvas.toDataURL(),width:j.canvas.width,height:j.canvas.height};return b(c)}),a.$on("canvas:statusUpdate",function(a,b){var c=new Image;c.height=b.height,c.width=b.width,c.onload=function(){j.canvas.width=b.width,j.canvas.height=b.height,j.drawImage(c,0,0)},c.src=b.imageData}),a.$on("$destroy",function(){b.removeAllListeners("canvas:draw"),b.removeAllListeners("canvas:reset"),b.removeAllListeners("canvas:resize")})}}}]),angularApp.directive("logindirective",["$window",function(a){return{restrict:"A",link:function(b,c){function d(){var b=a.innerHeight/2-225;c.css("margin-top",b)}d(),angular.element(a).bind("resize",function(){d()}),angular.element(c).bind("resize",function(){d()})}}}]),angularApp.directive("map",["$window","$timeout","socketIOService","$dialog",function(a,b,c,d){return{restrict:"E",replace:!0,template:"<div></div>",link:function(a,e,f){function g(){var a={zoom:6,center:new google.maps.LatLng(46.87916,-3.3291),mapTypeId:google.maps.MapTypeId.ROADMAP,streetViewControl:!1};o=new google.maps.Map(document.getElementById(f.id),a),h()}function h(){function b(a){function b(a){null!=f&&f.position.d===a.latitude&&f.position.e==a.longitude&&f.title===a.oldTitle&&f.setTitle(a.title)}function e(a){null!=f&&f.position.d===a.latitude&&f.position.e==a.longitude&&(c.removeListener("map:markerRemove",e),c.removeListener("map:markerTitleEdit",b),google.maps.event.clearListeners(f,"click"),google.maps.event.clearListeners(f,"rightclick"),f.setMap(null),f=null)}r.push(a);var f=new google.maps.Marker({position:new google.maps.LatLng(a.latitude,a.longitude),title:a.title});f.setMap(o),c.on("map:markerRemove",e),c.on("map:markerTitleEdit",b),google.maps.event.addListener(f,"click",function(){s.resolve={title:function(){return"Edit Marker Title"},inputText:function(){return f.title}};var a=d.dialog(s);a.open().then(function(a){if("undefined"!=typeof a){var b=f.title;f.setTitle(a);var d={latitude:f.position.d,longitude:f.position.e,title:f.title,oldTitle:b};c.emit("map:markerTitleEdit",d)}})}),google.maps.event.addListener(f,"rightclick",function(){var a={latitude:f.position.d,longitude:f.position.e,title:f.title};c.emit("map:markerRemove",a),e(a)})}a.$on("map:statusUpdate",function(a,c){for(var d=0;d<c.markers.length;d++)b(c.markers[d])}),c.on("map:markerAdd",b),c.on("map:markerRemove",i),c.on("map:markerTitleEdit",j),google.maps.event.addListener(o,"click",function(a){var d={latitude:a.latLng.d,longitude:a.latLng.e,title:"Left click to edit this text, right click to remove me."};c.emit("map:markerAdd",d),b(d)}),google.maps.event.addListener(o,"bounds_changed",function(){p=!0}),google.maps.event.addListener(o,"maptypeid_changed",function(){p=!0})}function i(a){for(var b=0;b<r.length;b++){var c=r[b];if(a.title===c.title&&a.latitude===c.latitude&&a.longitude===c.longitude){r.splice(b,1);break}}}function j(a){for(var b=0;b<r.length;b++){var c=r[b];if(a.oldTitle===c.title&&a.latitude===c.latitude&&a.longitude===c.longitude){r[b].title=a.title;break}}}function k(){n=b(function(){l(),k()},300)}function l(){if(p){var a=o.getCenter(),b={latitude:a.lat(),longitude:a.lng(),zoomLevel:o.getZoom()};q||(c.emit("map:positionUpdate",b),console.log(b)),p=!1}}var m,n,o=null,p=!1,q=!1,r=[],s={backdrop:!1,keyboard:!0,backdropClick:!0,templateUrl:"../modals/prompt",controller:"PromptModalController"};b(g,0);var t=a.$on("map:following",function(a,b){m=b.followUser,q=b.isFollowing,c.emit("map:following",b),console.log(b.isFollowing)}),u=a.$on("tab:change",function(a,c){"Maps"===c?(b.cancel(n),k(),o&&google.maps.event.trigger(o,"resize")):b.cancel(n)});c.on("map:positionUpdate",function(a){if(q&&a.userID===m){var b=new google.maps.LatLng(a.latitude,a.longitude);console.log(a),o.panTo(b),o.setZoom(a.zoomLevel)}}),a.$on("map:statusRequest",function(a,b){var c={markers:r};return b(c)}),a.$on("$destroy",function(){c.removeAllListeners("map:positionUpdate"),c.removeAllListeners("map:statusUpdate"),c.removeAllListeners("map:markerAdd"),c.removeAllListeners("map:markerRemove"),c.removeAllListeners("map:markerTitleEdit"),t(),u()})}}}]),angularApp.directive("numericinputonlydirective",function(){return{require:"ngModel",link:function(a,b,c,d){function e(a){var b=a.replace(/[^0-9]/g,"");return b!==a&&(d.$setViewValue(b),d.$render()),b}d.$parsers.push(e)}}}),angularApp.factory("angularBroadcastService",["$rootScope",function(a){var b={};return b.broadCast=function(b,c){a.$broadcast(b,c)},b}]),angularApp.factory("clientStatusService",["angularBroadcastService","$rootScope","cookieService","$window","$http",function(a,b,c,d,e){var f=225,g=225,h=150,i=100,j=25,k=25,l=22,m=4,n=100,o=510,p=510,q=f+g+h,r=j+k+i,s={},t={username:"",email:"",isLoggedIn:!1,picture:""};return s.checkLoginStatus=function(){var b=c.readCookie("token");if("undefined"!=typeof b){var d={token:b};e({method:"POST",url:"/api/getUser",data:d}).success(function(b){t.username=b.name,t.email=b.email,t.picture=b.picture,t.isLoggedIn=!0,a.broadCast("localUser:logInStatusUpdate",t)}).error(function(b){console.log(b),t.username="",t.email="",t.isLoggedIn=!1,a.broadCast("localUser:logInStatusUpdate",t)})}else t.isLoggedIn=!1,a.broadCast("localUser:logInStatusUpdate",t)},s.getRoomStatus=function(b){a.broadCast("canvas:statusRequest",function(c){a.broadCast("map:statusRequest",function(a){return b({canvas:c,map:a})})})},s.broadCastRoomStatusUpdate=function(b){a.broadCast("canvas:statusUpdate",b.canvas),a.broadCast("map:statusUpdate",b.map)},s.getOptimalCanvasSize=function(){var a={width:d.innerWidth-q,height:d.innerHeight-r};return a},s.getDefaultCanvasSize=function(){var a={width:o,height:p};return a},s.getMarginsForChat=function(){var a=j;return a+=k,a+=l,a+=m,a+=n},b.$on("localUser:update",function(a,b){t.username=b.username}),s.setUserData=function(a,b,c,d){t.username=a,t.email=b,c&&(t.picture=c),t.isLoggedIn=d},s.getUserData=function(){return t},s}]),angularApp.factory("cookieService",function(){var a={};return a.readCookie=function(a){return $.cookie(a)},a.deleteCookie=function(a,b){return $.removeCookie(a,{path:b})},a.writeCookie=function(a,b,c){$.cookie(a,b,{path:c})},a}),angularApp.factory("safeApplyService",function(){var a={};return a.apply=function(a,b){var c=a.$root.$$phase;"$apply"==c||"$digest"==c?b&&a.$eval(b):b?a.$apply(b):a.$apply()},a}),angularApp.factory("socketIOService",["$rootScope","safeApplyService","$location","$window",function(a,b,c,d){var e=d.location.origin,f={};a.$broadcast("socket:connecting",null),console.log("Connecting socket");var g=io.connect(e);return a.$on("socket:connect",function(){"undefined"==typeof g||g.socket.connected||(a.$broadcast("socket:connecting",null),console.log("Reconnecting socket"),g.socket.connect())}),a.$on("socket:disconnect",function(){"undefined"!=typeof g&&g.socket.connected&&(console.log("Disconnecting socket"),g.disconnect(),"/"!==c.path()&&b.apply(a,function(){c.path("/")}))}),g.on("connect",function(){console.log("Socket is connected"),a.$broadcast("socket:connected",null)}),g.socket.on("error",function(d){console.log(d),"handshake error"===d&&console.log("Socket connection rejected."),b.apply(a,function(){c.path("/")})}),f.on=function(c,d){g.on(c,function(){var c=arguments;b.apply(a,function(){d.apply(g,c)})})},f.emit=function(c,d,e){g.emit(c,d,function(){var c=arguments;b.apply(a,function(){e&&e.apply(g,c)})})},f.removeAllListeners=function(a){g.removeAllListeners(a)},f.removeListener=function(a,b){g.removeListener(a,b)},f.getSocketID=function(){return g.socket.sessionid},f.isConnected=function(){return g.socket.connected},f}]),angularApp.factory("webRTCService",["$rootScope","safeApplyService","$location","socketIOService",function(a,b,c,d){function e(){if(null==n||!n.isLoggedIn()){var a=d.getSocketID();k={username:a,id:a},window.vlineClient=n=vline.Client.create({serviceId:p,ui:!1}),n.on("login",g),n.on("logout",f),n.on("add:mediaSession",h,this),n.login(p,k,j)}}function f(){console.log("logged out")}function g(a){o=a.target,console.log(o.getLocalPersonId())}function h(b){var c=b.target;c.on("enterState:incoming",i),c.on("enterState:closed",function(){console.log("closed media session"),d(),e()}),c.on("mediaSession:addRemoteStream",function(b){var c=b.stream,d=c.getPerson(),e=d.getUsername(),f=c.createMediaElement();f.volume=.5;a.$on("rtc:volumeChange",function(a,b){b.id==e&&(console.log("VOLUME CHANGED"),f.volume=b.volume/100,console.log("changed"+b.id+"'s volume to: "+b.volume/100))})});var d=a.$on("rtc:enabledStatusChange",function(a,b){b||c.isClosed()||c.stop()}),e=a.$on("socket:disconnect",function(){c.isClosed()||c.stop()})}function i(a){console.log("Accepting call..");var b=a.target;b.start({video:!1,audio:!0})}var j,k,l={},m=!1,n=null,o=null,p="";return d.on("rtc:initData",function(a){console.log(a),j=a.token,p=a.serviceID,e()}),d.on("rtc:enabled",function(a){m&&null!=o&&o.getPerson(a.rtcID).done(function(b){console.log("calling "+a.rtcID),b.startMedia({video:!1,audio:!0})})}),a.$on("rtc:enabledStatusChange",function(a,b){m=b}),l.getID=function(){return o?o.getLocalPersonId():null},l.getServiceID=function(){return p},l.isLoggedIn=function(){return null!=n?n.isLoggedIn():!1},l}]);