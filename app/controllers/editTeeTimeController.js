/*jslint nomen: true, node: true */
/*global angular */

(function () {
    'use strict';
    var EditTeeTimeController = function ($scope, $window, $log, $routeParams, eventsFactory, coursesFactory, playersFactory) {
        var teeTimeId = $routeParams.teeTimeId;
        
        function init() {
            var i = 0,
                player = {
                    _id: "",
                    name: ""
                };
            $scope.event = {};
            $scope.courses = null;
            $scope.players = null;
            $scope.event.eventType = "Tee Time";
            
            eventsFactory.getTeeTime(teeTimeId)
                .error(function (data, status, headers, config) {
                    $log.warn("Edit Tee Time - server error reading Event info: ", status);
                })
                .success(function (event) {
                    $scope.event = event;
                    $scope.dt = new Date($scope.event.dateTime);
                    coursesFactory.getCourses()
                        .error(function (data, status, headers, config) {
                            $log.warn("Edit Tee Time - server error reading course info: ", status);
                        })
                        .success(function (courses) {
                            $scope.courses = courses;

                            playersFactory.getPlayerNames()
                                .error(function (data, status, headers, config) {
                                    $log.warn("Edit Tee Time - server error reading player info: ", status);
                                })
                                .success(function (players) {
                                    var i = 0;
                                    for (i = 0; i < players.length; i += 1) {
                                        players[i].lastName = players[i].lastName + ", " + players[i].firstName;
                                    }
                                    $scope.players = players;
                                });
                        });
                });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.updateTeeTime = function () {
            var i = 0;
            $log.info("Edit event for: ", $scope.event.eventType);
//
//==========================================================================================
//  Procedure to update tee time record with revised user input. Called by HTML update dialog directly.
//==========================================================================================
            
            $scope.event.dateTime = $scope.dt.toISOString();
            eventsFactory.updateEvent($scope.event)
                .error(function (data, status, headers, config) {
                    $log.warn("Edit Round - error updating entry in database: ", JSON.stringify({data: data}));
                    $window.alert("Server error adding tee time.");
                })
                .success(function (data) {
                    $log.info("Data: ", data);
                    $window.alert("Tee Time event successfully updated in database.");
                });
        };
        
    };

    EditTeeTimeController.$inject = ['$scope', '$window', '$log', '$routeParams', 'eventsFactory', 'coursesFactory', 'playersFactory'];

    angular.module('golfApp')
        .controller('EditTeeTimeController', EditTeeTimeController);
    
}());