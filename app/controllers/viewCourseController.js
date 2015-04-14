/*jslint nomen: true, node: true */
/*global angular */

(function () {
    'use strict';
    var ViewCourseController = function ($scope, $window, $log, $routeParams, coursesFactory, roundsFactory, playersFactory) {
        var courseId = $routeParams.courseId,
            tee = {};
        $scope.course = null;
        $scope.rounds = null;
        $scope.tees = null;
        
// Procedure to remove a Tee Box:
//      1.  query the database for the Tee Box to be removed.
//      2.  prompt the user for confirmation on the removal.
//      3.  call the Courses factory to process the removal.
//      4.  confirm that the Tee Box has been removed by attempting to query again

        $scope.removeTeeBox = function (teeId) {
            coursesFactory.getTee(teeId)                                                          /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.warn("Remove Tee Box - server error reading Tee Box info: ", status);
                    $window.alert("Unable to access Tee Box in database.\nTee Box not removed.");
                })
                .success(function (tee) {
                    var userResp = $window.confirm("Remove " + tee.teeName + " Tee Box from " + tee.courseTag + "?");
                    if (userResp) {                                                                     /*  Step 2  */
                        coursesFactory.removeTeeBox(tee._id)                                            /*  Step 3  */
                            .error(function (data, status, headers, config) {
                                $log.warn("Remove Tee Box - server error removing Tee Box.", status);
                                $window.alert("Server error, Tee Box not removed.");
                            })
                            .success(function (data) {
                                coursesFactory.getTee(data.electionId)                                     /*  Step 4  */
                                    .error(function (data, status, headers, config) {
                                        $log.warn("Remove Tee Box - unable to confirm removal.", status);
                                        $window.alert("Tee Box removal requested, unable to confirm.");
                                    })
                                    .success(function (tee) {
                                        if (null !== tee) {
                                            $log.warn("Remove Tee - tee box still in database.");
                                            $window.alert("Server error removing Tee Box; not removed.");
                                        } else {
                                            $log.info("Remove Tee Box - tee box successfully removed.");
                                            $window.alert("Tee Box successfully removed.");
                                        }
                                    });
                                
                            });
                    }
                });
        };
        
        function init() {
            coursesFactory.getCourse(courseId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server error getting Courses data; ', status);
                    $log.warn('Data: ', data);
                })
                .success(function (course) {
                    $scope.course = course;
            
                    coursesFactory.getCourseTees(courseId)
                        .success(function (tees) {
                            $scope.tees = tees;
                        })
                        .error(function (data, status, headers, config) {
                            $log.warn('Server error getting Tees data; ', status);
                            $log.warn('Data: ', data);
                        });
                    
                    roundsFactory.getCourseRounds(courseId)
                        .error(function (data, status, headers, config) {
                            $log.warn('Server error getting course rounds:', status);
                            $log.warn('Data: ', data);
                        })
                        .success(function (rounds) {
                            playersFactory.getPlayers()
                                .error(function (data, status, headers, config) {
                                    $log.warn('Server error getting player names: ', status);
                                    $log.warn('Data: ', data);
                                })
                                .success(function (players) {
                                    var i = Number,
                                        j = Number;
                                    for (i = 0; i < rounds.length; i += 1) {
                                        for (j = 0; j < players.length; j += 1) {
                                            if (rounds[i].playerId === players[j]._id) {
                                                rounds[i].playerName = players[j].firstName + " " + players[j].lastName;
                                                break;
                                            }
                                        }
                                    }
                                });
                            $scope.rounds = rounds;
                        });
                });
        }
        
        init();
        
        $scope.addTeeBoxToTees = function (t) {
            var disabled = true;
            
            if (disabled) {
                $window.alert("Function disabled.");
                return;
            }
            
            $log.log('Add Tee to Tees:', $scope.course.name, '/', t.teeName);
            tee.teeName = t.teeName;
            tee.courseId = $scope.course._id;
            tee.rating = t.courseRating;
            tee.slope = t.slopeRating;
            tee.yds = t.yds;

            coursesFactory.addTee(tee)
                .success(function (data, status, headers, config) {
                    console.log("Tee box added to database: ", tee.teeName);
                    $window.alert("Tee Box " + tee.teeName + " added to database.");
                })
                .error(function (data, status, headers, config) {
                    $log.warn("Error adding Tee Box to database: ", status);
                });
        };
        
    };
    
    ViewCourseController.$inject = ['$scope', '$window', '$log', '$routeParams', 'coursesFactory', 'roundsFactory', 'playersFactory'];

    angular.module('golfApp').controller('ViewCourseController', ViewCourseController);
    
}());