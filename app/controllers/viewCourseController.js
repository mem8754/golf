(function () {
    'use strict';
    var ViewCourseController = function ($scope, $window, $log, $routeParams, coursesFactory, roundsFactory, playersFactory) {
        var courseId = $routeParams.courseId,
            tee = {};
        $scope.course = null;
        $scope.rounds = null;
        $scope.tees = null;
        
        function init() {
            coursesFactory.getCourse(courseId)
                .error(function (data, status, headers, config) {
                    console.log('Error on AJAX call for getCourse');
                    console.log('Data: ' + data);
                    console.log('Status: ' + status);
                    console.log('Headers: ' + headers);
                    console.log('Config: ' + config);
                })
                .success(function (course) {
                    $scope.course = course;
            
                    coursesFactory.getTees(courseId)
                        .success(function (tees) {
                            $scope.tees = tees;
                        })
                        .error(function (data, status, headers, config) {
                            console.log('Error on AJAX call for getTees');
                            console.log('Data: ' + data);
                            console.log('Status: ' + status);
                            console.log('Headers: ' + headers);
                            console.log('Config: ' + config);
                        });
                    
                    roundsFactory.getCourseRounds(courseId)
                        .error(function (data, status, headers, config) {
                            $log.error('Server error getting course rounds.');
                        })
                        .success(function(rounds) {
                            playersFactory.getPlayers()
                                .error(function(data, status, headers, config) {
                                    $log.error('Server error getting player names.');
                                })
                                .success(function (players) {
                                    for (var i in rounds) {
                                        for (var j in players) {
                                            if (rounds[i].playerId == players[j]._id) {
                                                rounds[i].playerName = players[j].firstName + " " + players[j].lastName;
                                                break;
                                            };
                                        };
                                    };
                                });
                            $scope.rounds = rounds;
                        });
                });
        }
        
        init();
        
        $scope.addTeeBoxToTees = function (t) {
            $scope.teeMessage = "Function disabled."
            return;
            
            console.log('Add Tee to Tees:', $scope.course.name, '/', t.teeName);
            tee.teeName = t.teeName;
            tee.courseId = $scope.course._id;
            tee.rating = t.courseRating;
            tee.slope = t.slopeRating;
            tee.yds = t.yds;

            coursesFactory.addTee(tee)
                .success(function (data, status, headers, config) {
                    console.log("Tee box added to database: ", tee.teeName);
                    $scope.teeMessage = "Tee Box " + tee.teeName + " added to database.";
                })
                .error(function (data, status, headers, config) {
                    console.log("Error adding Tee Box to database: ", JSON.stringify({data: data}));
                });
        };
        
    };
    
    ViewCourseController.$inject = ['$scope', '$window', '$log', '$routeParams', 'coursesFactory', 'roundsFactory', 'playersFactory'];

    angular.module('golfApp')
        .controller('ViewCourseController', ViewCourseController);
    
}());