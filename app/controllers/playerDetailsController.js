(function () {
    'use strict';
    var PlayerDetailsController = function ($scope, $window, $log, $routeParams, playersFactory, roundsFactory) {
        var playerId = $routeParams.playerId;
        $log.log('Players: ', $scope.players);
        $log.log('Player ID: ', $routeParams.playerId);
        $scope.player = {};
        $scope.rounds = [];
        
        function init() {
            playersFactory.getPlayer(playerId)
                .success(function (player) {
                    $log.log('Player: ', player);
                    $scope.player = player;
                })
                .error(function (data, status, headers, config) {
                    $window.alert('Error reading player details from database.');
                    $log.error('Data: ', data);
                    $log.error('Status: ', status);
                });
            
            roundsFactory.getPlayerRounds(playerId)
                .success(function (playerRounds) {
                    $log.log('Rounds: ', playerRounds);
                    $scope.rounds = playerRounds;
                })
                .error(function (data, status, headers, config) {
                    $window.alert('Error reading player rounds from database.');
                    $log.error('Data: ', data);
                    $log.error('Status: ', status);
                });
        }
        
        init();

        $scope.calcHandicap = function () {
            $log.log('Calculate Handicap Index for Player:', $scope.player.lastName);
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
        
    PlayerDetailsController.$inject = ['$scope', '$window', '$log', '$routeParams', 'playersFactory', 'roundsFactory'];

    angular.module('golfApp')
        .controller('PlayerDetailsController', PlayerDetailsController);
    
}());