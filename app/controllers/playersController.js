(function () {
    'use strict';
    var PlayersController = function ($scope, playersFactory) {
        $scope.pSortBy = 'lastName';
        $scope.pReverse = false;
        $scope.players = [];
        
        function init() {
            playersFactory.getPlayers()
                .success(function (players) {
                    $scope.players = players;
                })
                .error(function (data, status, headers, config) {
                    console.log('Error on AJAX call for getPlayers');
                    console.log('Data: ' + data);
                    console.log('Status: ' + status);
                    console.log('Headers: ' + headers);
                    console.log('Config: ' + config);
                });
        }
        
        init();
        
        $scope.doSort = function (propName) {
            console.log('Player Sort: ' + propName + '; ' + $scope.pReverse);
            if (propName == $scope.pSortBy) {
                $scope.pReverse = !$scope.pReverse;
            } else {
                $scope.pReverse = false;
                $scope.pSortBy = propName;
            }
        };
    };
    
    PlayersController.$inject = ['$scope', 'playersFactory'];

    angular.module('golfApp')
        .controller('PlayersController', PlayersController);
    
}());