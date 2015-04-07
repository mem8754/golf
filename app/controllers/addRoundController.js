(function () {
    'use strict';
    var AddRoundController = function ($scope, $routeParams, playersFactory, coursesFactory, roundsFactory) {
        var playerId = $routeParams.playerId;
        $scope.round = {};
        
        function init() {
            playersFactory.getPlayerHcp(playerId)
                .error(function (data, status, headers, config) {
                    console.log('Server Error on AJAX call for getPlayer: ', status);
                    console.log('Data: ' + data);
                })
                .success(function (player) {
                    console.log('Player: ', player);
                    $scope.round.playerId = playerId;
                    $scope.playerName = player.firstName + " " + player.lastName;
                    coursesFactory.getCourses()
                        .error(function (data, status, headers, config) {
                            console.log('Error on AJAX call for getCourses: ', status);
                            console.log('Data: ' + data);
                        })
                        .success(function (courses) {
                            $scope.courses = courses;
                        });
                });

        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.addRound = function () {
            var i = 0;
            $scope.rmsg1 = "";
            $scope.rmsg2 = "";
            $scope.rmsg3 = "";
            console.log('Add Round:', $scope.round);
//
//==========================================================================================
//  Steps to add round:
//      1.  Query DB for tee info for the specified course (courseId)
//      2.  loop through course tees to find a match on user-provided tee name, grab tee index
//      3.  if tee name not found in course info, default to tee index 0
//      4.  Add the skeleton round information to the database.
//==========================================================================================
            coursesFactory.getTees($scope.round.courseId)
                .error(function (data, status, headers, config) {
                    window.alert("Error - unable to load tees for course: \n", JSON.stringify({data: data}));
                })
                .success(function (tees) {
                    if (tees === null) {
                        $window.alert("Error - no tee boxes defined for selected course.");
                        return;
                    }
                    for (i = 0; i < tees.length; i += 1) {      /*  Step 2  */
                        if (tees[i].teeName === $scope.teeName) {
                            $scope.round.teeIndex = i;
                            break;
                        }
                    }

                    if (undefined === $scope.round.teeIndex) {          /*  Step 3  */
                        window.alert ("Specified tee name not found.");
                        $scope.rmsg2 = "Tee not found";
                        return;
                    }

                    roundsFactory.addRound($scope.round)                /*  Step 4  */
                        .success(function (data, status, headers, config) {
                            $scope.message = data;
                            window.alert("Round successfully added to database.");
                            $location.path('/rounds/' + $scope.round.playerId);
                        })
                        .error(function (data, status, headers, config) {
                            console.log("Add Round - error adding to database: ", JSON.stringify({data: data}));
                            window.alert("Server error adding round.");
                        });
                });
        };
        
    };

    
    AddRoundController.$inject = ['$scope', '$routeParams', 'playersFactory', 'coursesFactory', 'roundsFactory'];

    angular.module('golfApp')
        .controller('AddRoundController', AddRoundController);
    
}());