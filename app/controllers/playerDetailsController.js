(function () {
    'use strict';
    var PlayerDetailsController = function ($scope, $routeParams, playersFactory, roundsFactory) {
        var playerId = $routeParams.playerId;
        console.log('Players: ', $scope.players);
        console.log('Player ID: ', $routeParams.playerId);
        $scope.player = {};
        $scope.rounds = [];
        
        function init() {
            playersFactory.getPlayer(playerId)
                .success(function (player) {
                    console.log('Player: ', player);
                    $scope.player = player;
                    $scope.hdcpIndex = player.hdcp;
                })
                .error(function (data, status, headers, config) {
                    console.log('Error on AJAX call for getPlayer');
                    console.log('Data: ' + data);
                    console.log('Status: ' + status);
                    console.log('Headers: ' + headers);
                    console.log('Config: ' + config);
                });
            
            roundsFactory.getPlayerRounds(playerId)
                .success(function (playerRounds) {
                    console.log('Rounds: ', playerRounds);
                    $scope.rounds = playerRounds;
                })
                .error(function (data, status, headers, config) {
                    console.log('Error on AJAX call for getRounds');
                    console.log('Data: ' + data);
                    console.log('Status: ' + status);
                    console.log('Headers: ' + headers);
                    console.log('Config: ' + config);
                });
        }
        
        init();

        $scope.calcHandicap = function () {
            console.log('Calculate Handicap Index for Player:', $scope.player.lastName);
            $scope.hdcpIndex = playersFactory.updatePlayerHdcp($scope.player, $scope.rounds);
        };

    };
        
    PlayerDetailsController.$inject = ['$scope', '$routeParams', 'playersFactory', 'roundsFactory'];

    angular.module('golfApp')
        .controller('PlayerDetailsController', PlayerDetailsController);
    
}());