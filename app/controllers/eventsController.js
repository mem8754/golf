/*jslint nomen: true, plusplus: true*/
/*global console, require, process, __dirname, angular*/

(function () {
    'use strict';
    var EventsController = function ($scope, $window, $log, eventsFactory, coursesFactory, playersFactory) {

        $scope.scheduledTeeTimes = null;
        $scope.pastTeeTimes = null;
        $scope.courseNames = null;
        $scope.playerNames = null;

        $scope.removeEvent = function (teeTimeId) {

// Procedure to remove an Event (tee time event, in this case):
//      1.  query the database for the event ID to be removed.
//      2.  prompt the user for confirmation on the removal.
//      3.  call the Events factory to process the removal.
//      4.  confirm that the event has been removed by attempting to query again

            
            eventsFactory.getTeeTime(teeTimeId)                                                          /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.warn("Remove Tee Time - server error reading Event info: ", status);
                    $window.alert("Tee Time event not removed, server error on event read.");
                })
                .success(function (event) {
                    var userResp = $window.confirm("Remove " + event.eventType + "Event for " + event.dateTime + "?");
                    if (userResp) {                                                                     /*  Step 2  */
                        eventsFactory.removeEvent(event._id)                                            /*  Step 3  */
                            .error(function (data, status, headers, config) {
                                $log.warn("Remove Tee Time - server error removing Event.", status);
                                $window.alert("Server error, Event not removed.");
                            })
                            .success(function (data) {
                                eventsFactory.getTeeTime(event._id)                                     /*  Step 4  */
                                    .success(function (event) {
                                        if (null !== event) {
                                            $log.warn("Remove Tee Time - event still in database.");
                                            $window.alert("Server error removing event; not removed.");
                                        } else {
                                            $log.info("Remove Tee Time - event successfully removed.");
                                            $window.alert("Tee Time Event successfully removed.");
                                        }
                                    });
                                
                            });
                    }
                });
        };
        
        function init() {
            
// Begin by getting the future Tee Times from the database.
            
            eventsFactory.getScheduledTeeTimes()
                .error(function (data, status, headers, config) {
                    $log.error('Error getting scheduled Tee Times: ', status);
                })
                .success(function (futureTT) {
                    $scope.scheduledTeeTimes = futureTT;
                
// If successful, read the past Tee Times from the database.
                
                    eventsFactory.getPastTeeTimes()
                        .error(function (data, status, headers, config) {
                            $log.error('Error getting past Tee Times: ', status);
                        })
                        .success(function (pastTT) {
                            $scope.pastTeeTimes = pastTT;

// If successful, read the course tags (and _id's) from the database.
                        
                            coursesFactory.getCourseNames()
                                .error(function (data, status, headers, config) {
                                    $log.error('Server error getting course names.');
                                })
                                .success(function (courseNames) {
                                    $scope.courseNames = courseNames;
                                
// If successful, read the player names (and _id's) from the database.
                                
                                    playersFactory.getPlayerNames()
                                        .error(function (data, status, headers, config) {
                                            $log.error('Server error getting player names.');
                                        })
                                        .success(function (playerNames) {
                                            var i = 0, j = 0, k = 0;
                                            $scope.playerNames = playerNames;

// Iterate through the future Tee Times to insert the course name into the Tee Time object, based on a match of the course ID.
                                        
                                            for (i = 0; i < $scope.scheduledTeeTimes.length; i++) {
                                                for (j = 0; j < $scope.courseNames.length; j++) {
                                                    if ($scope.scheduledTeeTimes[i].courseId === $scope.courseNames[j]._id) {
                                                        $scope.scheduledTeeTimes[i].courseTag = $scope.courseNames[j].tag;
                                                        break;
                                                    }
                                                }
                                                
// Iterate through the future Tee Times to insert up to four player names into the Tee Time object, using the player ID.
// (make sure the player ID is not null)
                                                
                                                $scope.scheduledTeeTimes[i].playerName = [];
                                                for (j = 0; j < 4; j++) {
                                                    $scope.scheduledTeeTimes[i].playerName[j] = "- Open -";
                                                    for (k = 0; k < $scope.playerNames.length; k++) {
                                                        if (null !== $scope.scheduledTeeTimes[i].players[j] &&
                                                                $scope.scheduledTeeTimes[i].players[j] === $scope.playerNames[k]._id) {
                                                            $scope.scheduledTeeTimes[i].playerName[j] = $scope.playerNames[k].lastName +
                                                                                                        ", " +
                                                                                                        $scope.playerNames[k].firstName;
                                                            break;
                                                        }
                                                    }
                                                }
                                                
                                            }
                                        
// Iterate through the past Tee Times to insert the course names, as done above for future Tee Times.
                                        
                                            for (i = 0; i < $scope.pastTeeTimes.length; i++) {
                                                for (j = 0; j < $scope.courseNames.length; j++) {
                                                    if ($scope.pastTeeTimes[i].courseId === $scope.courseNames[j]._id) {
                                                        $scope.pastTeeTimes[i].courseTag = $scope.courseNames[j].tag;
                                                        break;
                                                    }
                                                }
                                                
// iterate through the past Tee Times to insert player names, as was done above for the future Tee Times.
                                                
                                                $scope.pastTeeTimes[i].playerName = [];
                                                for (j = 0; j < 4; j++) {
                                                    $scope.pastTeeTimes[i].playerName[j] = "- Open -";
                                                    for (k = 0; k < $scope.playerNames.length; k++) {
                                                        if (null !== $scope.pastTeeTimes[i].players[j] &&
                                                                $scope.pastTeeTimes[i].players[j] === $scope.playerNames[k]._id) {
                                                            $scope.pastTeeTimes[i].playerName[j] = $scope.playerNames[k].lastName +
                                                                                                    ", " +
                                                                                                    $scope.playerNames[k].firstName;
                                                            break;
                                                        }
                                                    }
                                                }
                                                
                                            }
                                        });
                                });
                        });
                });
        }
        
        init();
        
    };
    
    EventsController.$inject = ['$scope', '$window', '$log', 'eventsFactory', 'coursesFactory', 'playersFactory'];

    angular.module('golfApp')
        .controller('EventsController', EventsController);
    
}());