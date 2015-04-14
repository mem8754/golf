/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';
    var AddRoundController = function ($scope, $window, $log, $routeParams, playersFactory, coursesFactory, roundsFactory) {
        var playerId = $routeParams.playerId;
        $scope.round = {};
        
        function init() {
            playersFactory.getPlayerHcp(playerId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server Error on AJAX call for getPlayer: ', status);
                    $log.info('Data: ' + data);
                })
                .success(function (player) {
                    $log.info('Player: ', player);
                    $scope.round.playerId = playerId;
                    $scope.playerName = player.firstName + " " + player.lastName;
                
                    coursesFactory.getCourses()
                        .error(function (data, status, headers, config) {
                            $log.warn('Server Error getting Courses for New Round: ', status);
                        })
                        .success(function (courses) {
                            $scope.courses = courses;
                        });
                });
        }
   
        init();
        
        $scope.updateTeeBoxes = function () {
  
            coursesFactory.getCourseTees($scope.round.courseId)
                .error(function (data, status, headers, config) {
                    $log.warn("Server error reading Tees for course: ", status);
                })
                .success(function (tees) {
                    if (tees !== null && tees.length > 0) {
                        $scope.tees = tees;
                    } else {
                        $window.alert("No tee boxes are defined for this course.\nPlease select a different course.");
                    }
                });
        };
        
//==========================================================================================
//  Function to post a round to the "rounds" database (via the rounds Factory)
//      Steps to add round:
//      1.  Query DB for the requested tee box
//      2.  Confirm tee's course ID is equal to selected course ID ($scope.round.courseId)
//      3.  Add tee's name to the round object
//      4.  Query DB for the requested course
//      5.  Add course's tag to the round object
//      4.  Post the skeleton round information to the database via call to Factory
//==========================================================================================
        
        $scope.addRound = function () {
            var i = 0;
            $log.info('Add Round:', $scope.round);
//
            coursesFactory.getTee($scope.round.teeId)                   /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.warn("Server Error getting tee information: ", status);
                })
                .success(function (tee) {
                    if (tee === null) {
                        $window.alert("Unable to retrieve Tee Box information.\nRound not added.");
                        return;
                    }
                
                    if (tee.courseId !== $scope.round.courseId) {       /*  Step 2  */
                        $window.alert("Internal Error: Selected Tee Box is not for selected Course.\nUnable to post round.");
                        return;
                    }
                    $scope.round.teeName = tee.teeName;                 /*  Step 3  */
                
                    coursesFactory.getCourse($scope.round.courseId)     /*  Step 4  */
                        .error(function (data, status, headers, config) {
                            $log.warn("Server Error getting course information: ", status);
                        })
                        .success(function (crs) {
                            $scope.round.courseTag = crs.tag;           /*  Step 5  */

                            roundsFactory.addRound($scope.round)        /*  Step 6  */
                                .error(function (data, status, headers, config) {
                                    $log.warn("Server error posting Round to database: ", status);
                                    $window.alert("Server error posting round.\nRound not posted.");
                                })
                                .success(function (data, status, headers, config) {
                                    $scope.message = data;
                                    $window.alert("Round successfully posted to database.");
                                });
                        });
                });
        };
        
    };

    
    AddRoundController.$inject = ['$scope', '$window', '$log', '$routeParams', 'playersFactory', 'coursesFactory', 'roundsFactory'];

    angular.module('golfApp')
        .controller('AddRoundController', AddRoundController);
    
}());