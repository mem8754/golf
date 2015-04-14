/*global angular */

(function () {
    'use strict';
    var AddTeeBoxController = function ($scope, $window, $log, $routeParams, coursesFactory) {
        var courseId = $routeParams.courseId;
        $scope.tee = {};
        
        function init() {
            $scope.tee.courseId = courseId;
            coursesFactory.getCourse(courseId)
                .error(function (data, status, headers, config) {
                    $log.warn("Add Tee Box - server error reading course info: ", status);
                    $log.warn("Data: ", data);
                    $window.alert("Server error reading course information.");
                })
                .success(function (course) {
                    $scope.courseTag = course.tag;
                });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.addTeeBox = function () {
            var i = 0;
            $log.info('Add Tee Box:', $scope.tee);
//
//==========================================================================================
//  Steps to add tee box:
//      1.  Query DB for tee info using provided "courseId"
//      2.  loop through course tees to locate a match on user-provided tee name, quit if found
//      3.  calculate front, back, and total yardages
//      4.  if tee name not found in course info, add this tee box info as a new entry
//==========================================================================================
            coursesFactory.getCourseTees(courseId)              /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.info("Add Tee Box error - course tees not retrieved. ", status);
                    $window.alert("Error - unable to load existing course tees from database.");
                })
                .success(function (tees) {
                    if (tees !== null) {
                        for (i = 0; i < tees.length; i += 1) {              /*  Step 2 */
                            if (tees[i].teeName === $scope.tee.teeName) {
                                $window.alert("That tee box already exists, please re-enter name");
                                return;
                            }
                        }
                    }

// if we make it here, the tee box name does not exist in the DB for this course, and can be added.

                    $scope.tee.yds[18] = 0;
                    $scope.tee.yds[19] = 0;
                    $scope.tee.yds[20] = 0;        /*  Step 3 */
                    for (i = 0; i < 9; i += 1) {
                        $scope.tee.yds[18] += $scope.tee.yds[i];
                        $scope.tee.yds[19] += $scope.tee.yds[i + 9];
                    }
                    $scope.tee.yds[20] = $scope.tee.yds[18] + $scope.tee.yds[19];

                    coursesFactory.addTee($scope.tee)                /*  Step 4  */
                        .error(function (data, status, headers, config) {
                            $log.warn("Add Round - error adding to database: ", JSON.stringify({data: data}));
                            $window.alert("Server error adding round.");
                        })
                        .success(function (data) {
                            $log.info("Data: ", data);
                            $window.alert("Tee Box successfully added to database.");
                        });
                });
        };
        
    };

    
    AddTeeBoxController.$inject = ['$scope', '$window', '$log', '$routeParams', 'coursesFactory'];

    angular.module('golfApp')
        .controller('AddTeeBoxController', AddTeeBoxController);
    
}());