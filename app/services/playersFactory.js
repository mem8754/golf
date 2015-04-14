(function () {
    'use strict';
    var playersFactory = function ($http) {
        
        var factory = {},
            players = null;
            
//==========================================================================================
//  calcHandicapIndex Function
//
//  This function calculates a handicap index from posted rounds. Input parameter(s):
//      - "rounds" array of objects containing all of the players posted rounds.
//          --  need to modify the query to ensure that only POSTED rounds are provided.
//
//  The function currently returns a single value which is the calculated handicap index.
//
//  Handicap Index calculation is as follows:
//      1.  Determine the number of handicap differentials to use (based on number of rounds posted)
//      2.  Determine handicap differentials (done at time of round posting in "updateRound")
//      3.  Average the handicap differentials being used
//      4.  Multiply the average by 0.96 (96%)
//      5.  Delete all numbers after the tenths' digit (truncate). Do not round to the nearest tenth. 
//==========================================================================================
        function calcHandicapIndex(rounds) {
            var hcpLookup = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9, 10],
                hcpDiffs = [],
                hcpIndex = 0,
                hcapRounds = 0,
                round = {},
                i = 0;

    //==========================================================================================
    //  Step 1.  Determine the handicap differentials to use.
    //==========================================================================================
            for (round in rounds) {
                if (undefined !== rounds[round].netScore) {         /* net score calculated - round posted */
                    hcpDiffs[i] = rounds[round].hdcpDiff;
                    i++;
                }
            }
            if (i <= 4) {                                       /* not enough rounds posted to calc idx */
                hcpIndex = 36.4;                                /* not enough rounds, set to max    */
            } else {
                if (i > 20) {
                    i = 20;
                }
                hcpDiffs.sort(function (a, b) {                 /*  sort by hcp diff descending         */
                    return a - b;
                });
                
                hcapRounds = hcpLookup[i];                      /* look up number of rounds to use      */
                
    //==========================================================================================
    //  Step 3.  Average the handicap differentials being used
    //==========================================================================================
                for (i = 0; i < hcapRounds; i++) {
                    hcpIndex += hcpDiffs[i];
                }
                hcpIndex /= hcapRounds;     /*  calculate average as sum / count            */

    //==========================================================================================
    //  Step 4.  Multiply the average by 0.96 (96%)
    //==========================================================================================
                hcpIndex *= 0.96;               /*  Hcp Index is 96% of average                 */

    //==========================================================================================
    //  Step 5.  Delete all numbers after the tenths' digit (truncate). 
    //==========================================================================================
                hcpIndex = Math.floor(hcpIndex * 10) / 10;
            }
            
            hcpIndex = Math.min(hcpIndex, 36.4);    /*  Can't be over 36.4                  */
            return (hcpIndex);
        }
            
        factory.getPlayers = function () {
            return $http.get('/players');
        };
        
        factory.getPlayerNames = function () {
            return $http.get('players/names');
        };
        
        factory.getPlayer = function (playerId) {
            return $http.get('/players/' + playerId);
        };
        
        factory.getPlayerHcp = function (playerId) {
            return $http.get('/player/hcp/' + playerId);
        };
        
        factory.calcPlayerHdcp = function (rounds) {
            return calcHandicapIndex(rounds);
        };
        
        factory.updatePlayerHdcp = function (player, hcp) {
            return $http.put('/player/hcp/' + player._id, { hdcp: hcp });
        };

           
        return factory;
    };

    playersFactory.$inject = ['$http'];
    
    angular.module('golfApp').factory('playersFactory', playersFactory);
    
}());