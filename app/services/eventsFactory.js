(function () {
    'use strict';
    var eventsFactory = function ($http, $log) {
        
        var factory = {};
        
        factory.getScheduledTeeTimes = function (dateTime) {
            return $http.get('/events/teeTimes/after', dateTime);
        };
        
        factory.getPastTeeTimes = function (dateTime) {
            return $http.get('/events/teeTimes/before', dateTime);
        };
        
        return factory;
    };
    
    eventsFactory.$inject = ['$http', '$log'];
    
    angular.module('golfApp').factory('eventsFactory', eventsFactory);
    
}());