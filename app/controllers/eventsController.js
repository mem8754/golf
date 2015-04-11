(function () {
    'use strict';
    var EventsController = function ($scope, $window, $log, eventsFactory, coursesFactory, playersFactory) {
        var rightNow = null;
        var refTime = "";

        $scope.scheduledTeeTimes = null;
        $scope.pastTeeTimes = null;
        $scope.courseNames = null;
        $scope.playerNames = null;
        
        function init() {
            
            rightNow = new Date();
            refTime = rightNow.toISOString();

// Begin by getting the future Tee Times from the database.
            
            eventsFactory.getScheduledTeeTimes(refTime)
                .error(function (data, status, headers, config) {
                    $log.error('Error getting scheduled Tee Times: ', status);
                })
                .success(function (futureTT) {
                    $scope.scheduledTeeTimes = futureTT;
                
// If successful, read the past Tee Times from the database.
                
                    eventsFactory.getPastTeeTimes(refTime)
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
                                        
                                            for (i in $scope.scheduledTeeTimes) {
                                                for (j in $scope.courseNames) {
                                                    if ($scope.scheduledTeeTimes[i].courseId == $scope.courseNames[j]._id) {
                                                        $scope.scheduledTeeTimes[i].courseTag = $scope.courseNames[j].tag;
                                                        break;
                                                    }
                                                }
                                                
// Iterate through the future Tee Times to insert up to four player names into the Tee Time object, using the player ID.
// (make sure the player ID is not null)
                                                
                                                $scope.scheduledTeeTimes[i].playerName = [];
                                                for (j = 0; j < 4; j++) {
                                                    $scope.scheduledTeeTimes[i].playerName[j] = "- Open -";
                                                    for (k in $scope.playerNames) {
                                                        if (null !== $scope.scheduledTeeTimes[i].players[j] &&
                                                                $scope.scheduledTeeTimes[i].players[j] == $scope.playerNames[k]._id) {
                                                            $scope.scheduledTeeTimes[i].playerName[j] = $scope.playerNames[k].lastName +
                                                                                                        ", " +
                                                                                                        $scope.playerNames[k].firstName;
                                                            break;
                                                        }
                                                    }
                                                }
                                                
                                            }
                                        
// Iterate through the past Tee Times to insert the course names, as done above for future Tee Times.
                                        
                                            for (i in $scope.pastTeeTimes) {
                                                for (j in $scope.courseNames) {
                                                    if ($scope.pastTeeTimes[i].courseId == $scope.courseNames[j]._id) {
                                                        $scope.pastTeeTimes[i].courseTag = $scope.courseNames[j].tag;
                                                        break;
                                                    }
                                                }
                                                
// iterate through the past Tee Times to insert player names, as was done above for the future Tee Times.
                                                
                                                $scope.pastTeeTimes[i].playerName = [];
                                                for (j = 0; j < 4; j++) {
                                                    $scope.pastTeeTimes[i].playerName[j] = "- Open -";
                                                    for (k in $scope.playerNames) {
                                                        if (null !== $scope.pastTeeTimes[i].players[j] &&
                                                                $scope.pastTeeTimes[i].players[j] == $scope.playerNames[k]._id) {
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