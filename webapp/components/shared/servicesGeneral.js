'use strict';

angular.module('ECMSapp.servicesGeneral', [])

.factory('WindowSizeFtry', [ '$rootScope' , '$window' ,function($rootScope, win) {

    var wrapperWidth;

      win.addEventListener('resize', function() {

              wrapperWidth = $("#wrapper").width();

              //BROADCAST THE WIDTH OF THE WRAPPER FOR THE WHOLE APPLICATION
             $rootScope.$broadcast('wrapperWidthChanges', wrapperWidth);

            }, false);

    return { }

 }]);