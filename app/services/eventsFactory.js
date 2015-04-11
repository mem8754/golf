(function () {
    'use strict';
    var eventsFactory = function ($http, $log) {
        
        var factory = {};
        
        factory.getScheduledTeeTimes = function (refTime) {
            return $http.get('/events/teeTimes/after/' + refTime);
        };
        
        factory.getPastTeeTimes = function (refTime) {
            return $http.get('/events/teeTimes/before/' + refTime);
        };
        
        factory.addEvent = function(event) {
            return $http.post('/events/add', event);
        };
        
        factory.getDuplicateEvent = function(date, type, courseId) {
            var event = {};
            event.date = date;
            event.type = type;
            event.crs = courseId;
            return $http.get('/events/findDup', event);
        };
        
        return factory;
    };
    
    eventsFactory.$inject = ['$http', '$log'];
    
    angular.module('golfApp').factory('eventsFactory', eventsFactory);
    
}());