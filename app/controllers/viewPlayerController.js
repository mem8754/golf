/*jslint node: true */
/*global angular */
/*jslint nomen: true*/

(function () {
    'use strict';
    var ViewPlayerController = function ($scope, $window, $log, $routeParams, playersFactory, roundsFactory, eventsFactory) {
        
        var playerId = $routeParams.playerId;
        
        $scope.player = {};
        $scope.rounds = [];
        
// Procedure to remove a Round:
//      1.  query the database for the Round ID to be removed.
//      2.  prompt the user for confirmation on the removal.
//      3.  call the Rounds factory to process the removal.
//      4.  confirm that the Round has been removed by attempting to query again

        $scope.removeRound = function (roundId) {
            roundsFactory.getRound(roundId)                                                          /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.warn("Remove Round - server error reading Round info: ", status);
                    $window.alert("Unable to access Round in database.\nRound not removed.");
                })
                .success(function (round) {
                    var userResp = $window.confirm("Remove Round at " + round.courseTag + " on " + round.date + "?");
                    if (userResp) {                                                                     /*  Step 2  */
                        roundsFactory.removeRound(round._id)                                            /*  Step 3  */
                            .error(function (data, status, headers, config) {
                                $log.warn("Remove Round - server error removing Round.", status);
                                $window.alert("Server error, round not removed.");
                            })
                            .success(function (data) {
                                roundsFactory.getRound(data.electionId)                                     /*  Step 4  */
                                    .error(function (data, status, headers, config) {
                                        $log.warn("Remove Round - unable to confirm removal.", status);
                                        $window.alert("Round removal requested, unable to confirm.");
                                    })
                                    .success(function (round) {
                                        if (null !== round) {
                                            $log.warn("Remove Round - round still in database.");
                                            $window.alert("Server error removing Round; not removed.");
                                        } else {
                                            $log.info("Remove Round - round successfully removed.");
                                            $window.alert("Round successfully removed.");
                                        }
                                    });
                                
                            });
                    }
                });
        };
        
        function init() {
            playersFactory.getPlayer(playerId)
                .success(function (player) {
                    $scope.player = player;
                })
                .error(function (data, status, headers, config) {
                    $log.error('Error reading player details: ', status);
                });
            
            roundsFactory.getPlayerRounds(playerId)
                .success(function (playerRounds) {
                    $scope.rounds = playerRounds;
                })
                .error(function (data, status, headers, config) {
                    $log.warn('Error reading player rounds: ', status);
                });
            
            eventsFactory.getFutureEvents(playerId)
                .error(function (data, status, headers, config) {
                    $log.warn("Error reading player events: ", status);
                })
                .success(function (playerEvents) {
                    var i = 0,
                        j = 0;
                    $scope.events = [];
                    for (i = 0; i < playerEvents.length; i += 1) {
                        for (j = 0; j < playerEvents[i].players.length; j += 1) {
                            if (playerEvents[i].players[j] === playerId) {
                                $scope.events.push(playerEvents[i]);
                                break;
                            }
                        }
                    }
                    $log.info("Converted events.");
                });
        }
        
        init();

        $scope.calcHandicap = function () {
            $scope.hdcpIndex = playersFactory.calcPlayerHdcp($scope.rounds);
            playersFactory.updatePlayerHdcp($scope.player, $scope.hdcpIndex)
                .success(function (data) {
                    $window.alert("Player Handicap updated.");
                })
                .error(function (data, status, headers, config) {
                    $window.alert("Error writing updated handicap to database.");
                    $log.error('Data: ', data);
                    $log.error('Status: ', status);
                });
        };

    };
        
    ViewPlayerController.$inject = ['$scope', '$window', '$log', '$routeParams', 'playersFactory', 'roundsFactory', 'eventsFactory'];

    angular.module('golfApp')
        .controller('ViewPlayerController', ViewPlayerController);
    
}());