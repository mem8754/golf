(function () {
    'use strict';
    var AddTeeTimeController = function ($scope, $window, $log, eventsFactory, coursesFactory, playersFactory) {

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
            
            coursesFactory.getCourses()
                .error(function (data, status, headers, config) {
                    $log.warn("Add Tee Time - server error reading course info: ", status);
                })
                .success(function (courses) {
                    $scope.courses = courses;

                    playersFactory.getPlayerNames()
                        .error(function (data, status, headers, config) {
                            $log.warn("Add Tee Time - server error reading player info: ", status);
                        })
                        .success(function (players) {
                            for (i in players) {
                                players[i].lastName = players[i].lastName + ", " + players[i].firstName;
                            }
                            $scope.players = players;
                        });
                });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.addTeeTime = function () {
            var i = 0;
            $log.info("Add event for: ", $scope.event.eventType);
//
//==========================================================================================
//  Steps to add tee time:
//      1.  Query DB for tee time with same date/time and course ID; quit if found.
//      2.  if duplicate tee time not found in events info, add this tee time event as a new entry
//==========================================================================================
            
            eventsFactory.getDuplicateEvent($scope.event.dateTime, $scope.event.eventType, $scope.event.courseId)          /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.warn("Add Tee Time - unable to retrieve matching events", status);
                    $window.alert("Error checking for duplicate events.\n Event not added, please try again.");
                })
                .success(function (events) {
                    if (events.length !== 0) {
                        $log.warn("Duplicate event submitted, rejected.");
                        $window.alert("Event already exists, please correct and re-submit.");
                        return;
                    }

// if we make it here, the tee box name does not exist in the DB for this course, and can be added.

                    eventsFactory.addEvent($scope.event)                                                                    /*  Step 4  */
                        .error(function (data, status, headers, config) {
                            $log.warn("Add Round - error adding to database: ", JSON.stringify({data: data}));
                            $window.alert("Server error adding tee time.");
                        })
                        .success(function (data) {
                            $log.info ("Data: ", data);
                            $window.alert("Tee Time event successfully added to database.");
                        });
                });
        };
        
    };

    
    AddTeeTimeController.$inject = ['$scope', '$window', '$log', 'eventsFactory', 'coursesFactory', 'playersFactory'];

    angular.module('golfApp')
        .controller('AddTeeTimeController', AddTeeTimeController);
    
}());