(function () {
    'use strict';
    var EditRoundController = function ($scope, $routeParams, coursesFactory, playersFactory, roundsFactory) {
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
                .success(function (round) {
                    console.log('Round: ', round);

                    $scope.round = round;

                    playersFactory.getPlayerHcp(round.playerId)
                        .error(function (data, status, headers, config) {
                            console.log('Error ', status, ' getting Player Hcp: ', data);
                        })
                        .success(function (player) {
                            console.log('Player Hcp Data: ', player);
                            $scope.playerName = player.firstName + " " + player.lastName;
                            $scope.round.hdcpIndex = player.hdcp;
                        });

                        coursesFactory.getCourseHdcp(round.courseId)
                            .success(function (course) {
                                console.log('Course Data: ', course);
                                $scope.round.courseTag = course.tag;
                                $scope.hcpData.par = course.par;
                                if (round.grossScore.length == 0) {
                                    $scope.round.grossScore = course.par;    
                                };
                            })
                            .error(function (data, status, headers, config) {
                                console.log('Error ', status, ' getting Course Hcp: ', round.courseId);
                             });

                        coursesFactory.getTees(round.courseId).success(function(tees) {
                            $scope.hcpData.courseRating = tees[round.teeIndex].rating;
                            $scope.hcpData.slopeRating = tees[round.teeIndex].slope;
                            $scope.teeName = tees[round.teeIndex].teeName;
                        }).error(function(data, status, headers, config) {
                            console.log('Error ', status, ' getting Tees: ', round.courseId);
                        });
                })
                .error(function (data, status, headers, config) {
                    console.log('Error ', status, ' on AJAX call for Round:', roundId);
                });
        }
   
        init();
    

        $scope.updateRound = function () {
            console.log('Update this Round:', $scope.round);
            roundsFactory.updateRound($scope.round, $scope.hcpData)
                .success(function (data, status, headers, config) {
                    $scope.message = data;
                })
                .error(function (data, status, headers, config) {
                    alert("Failure message: " + JSON.stringify({data: data}));
                });

        };
    };
    
    EditRoundController.$inject = ['$scope', '$routeParams', 'coursesFactory', 'playersFactory', 'roundsFactory'];

    angular.module('golfApp')
        .controller('EditRoundController', EditRoundController);
    
}());