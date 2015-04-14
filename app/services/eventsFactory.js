/*jslint nomen: true, plusplus: true*/
/*global console, require, process, __dirname, angular*/

(function () {
    'use strict';
    var eventsFactory = function ($http, $log) {
        
        var factory = {};
        
        factory.getFutureEvents = function (playerId) {
            return $http.get('/events/getFutureEvents');
        };
        
        factory.getScheduledTeeTimes = function () {
            return $http.get('/events/teeTimes/future');
        };
        
        factory.getPastTeeTimes = function () {
            return $http.get('/events/teeTimes/past');
        };
        
        factory.getTeeTime = function (teeTimeId) {
            return $http.get('/events/teeTime/' + teeTimeId);
        };
        
        factory.addEvent = function (event) {
            return $http.post('/events/add', event);
        };
        
        factory.updateEvent = function (event) {
            return $http.put('/events/update', event);
        };
        
        factory.getDuplicateEvent = function (date, type, courseId) {
            var event = {};
            event.date = date;
            event.type = type;
            event.crs = courseId;
            return $http.get('/events/findDup', event);
        };
        
        factory.removeEvent = function (eventId) {
            return $http.delete('/events/removeEvent/' + eventId);
        };
        
        return factory;
    };
    
    eventsFactory.$inject = ['$http', '$log'];
    
    angular.module('golfApp').factory('eventsFactory', eventsFactory);
    
}());