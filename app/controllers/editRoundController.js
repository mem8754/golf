/*jslint nomen: true, node: true */
/*global angular */

(function () {
    'use strict';
    var EditRoundController = function ($scope, $window, $log, $routeParams, coursesFactory, playersFactory, roundsFactory) {
        var roundId = $routeParams.roundId;
        $scope.round = {
            course: '',
            tee: '',
            grossScore: [],
            adjGrossScore: []
        };
        $scope.hcpData = {};
                                 
        function init() {
            roundsFactory.getRound(roundId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server Error getting Round:', status);
                })
                .success(function (round) {
                    $scope.round = round;

                    playersFactory.getPlayerHcp(round.playerId)
                        .error(function (data, status, headers, config) {
                            $log.warn('Error ', status, ' getting Player Hcp: ', data);
                        })
                        .success(function (player) {
                            $scope.playerName = player.firstName + " " + player.lastName;
                            $scope.round.hdcpIndex = player.hdcp;
                        });

                    coursesFactory.getCourseHdcp(round.courseId)
                        .error(function (data, status, headers, config) {
                            $log.warn('Error getting Course Hcp: ', status);
                        })
                        .success(function (course) {
                            $scope.round.courseTag = course.tag;
                            $scope.hcpData.par = course.par;
                            if (round.grossScore.length === 0) {
                                $scope.round.grossScore = course.par;
                            }
                        });
                    coursesFactory.getCourseTees(round.courseId)
                        .error(function (data, status, headers, config) {
                            $log.warn('Server Error getting Tees: ', status);
                        })
                        .success(function (tees) {
                            var i = $scope.round.teeIndex;
                            if (tees !== null && tees.length > i) {
                                $scope.round.teeId = tees[i]._id;
                                $scope.hcpData.courseRating = tees[i].rating;
                                $scope.hcpData.slopeRating = tees[i].slope;
                                $scope.teeName = tees[i].teeName;
                            } else {
                                $log.warn("Unable to find specified tees for this round.");
                            }
                        });
                });
        }
   
        init();
    

        $scope.updateRound = function () {
            $log.info('Update this Round:', $scope.round);
            roundsFactory.updateRound($scope.round, $scope.hcpData)
                .success(function (data, status, headers, config) {
                    $scope.message = data;
                })
                .error(function (data, status, headers, config) {
                    $log.warn("Server error updating round info: ", status);
                    $log.warn("Data: ", data);
                    $window.alert("Server error encountered, round not updated.");
                });

        };
    };
    
    EditRoundController.$inject = ['$scope', '$window', '$log', '$routeParams', 'coursesFactory', 'playersFactory', 'roundsFactory'];

    angular.module('golfApp')
        .controller('EditRoundController', EditRoundController);
    
}());