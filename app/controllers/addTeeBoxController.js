(function () {
    'use strict';
    var AddTeeBoxController = function ($scope, $routeParams, coursesFactory) {
        var courseId = $routeParams.courseId;
        $scope.tee = {};
        $scope.tmsg1 = "";
        $scope.tmsg2 = "";
        
        function init() {
            $scope.tee.courseId = courseId;
            coursesFactory.getCourse(courseId)
                .error(function (data, status, headers, config) {
                    console.log("Add Tee Box - server error reading course info: ", status);
                    console.log("Data: ", data);
                    $scope.tmsg2 = "Server error reading course information.";
                })
                .success(function (course) {
                    $scope.courseTag = course.tag;
                });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.addTeeBox = function () {
            var i = 0;
            $scope.tmsg1 = "";
            $scope.tmsg2 = "";
            console.log('Add Tee Box:', $scope.tee);
//
//==========================================================================================
//  Steps to add tee box:
//      1.  Query DB for tee info using provided "courseId"
//      2.  loop through course tees to locate a match on user-provided tee name, quit if found
//      3.  calculate front, back, and total yardages
//      4.  if tee name not found in course info, add this tee box info as a new entry
//==========================================================================================
            coursesFactory.getTees(courseId)              /*  Step 1  */
                .error(function (data, status, headers, config) {
                    console.log("Add Tee Box - course tees not retrieved. ", status);
                    $scope.tmsg2 = "Error - unable to load existing course tees from database.";
                })
                .success(function (tees) {
                    if (tees !== null) {
                        for (i = 0; i < tees.length; i += 1) {              /*  Step 2 */
                            if (tees[i].teeName === $scope.tee.teeName) {
                                $scope.tmsg1 = "That tee box already exists, please re-enter name";
                                return;
                            }
                        }
                    };

// if we make it here, the tee box name does not exist in the DB for this course, and can be added.

                    $scope.tee.yds[18] = 0;
                    $scope.tee.yds[19] = 0;
                    $scope.tee.yds[20] = 0;        /*  Step 3 */
                    for (i = 0; i < 9; i++) {
                        $scope.tee.yds[18] += $scope.tee.yds[i];
                        $scope.tee.yds[19] += $scope.tee.yds[i+9];
                    }
                    $scope.tee.yds[20] = $scope.tee.yds[18] + $scope.tee.yds[19];

                    coursesFactory.addTee($scope.tee)                /*  Step 4  */
                        .success(function (data) {
                            console.log ("Data: ", data);
                            window.alert("Tee Box successfully added to database.");
                        })
                        .error(function (data, status, headers, config) {
                            console.log("Add Round - error adding to database: ", JSON.stringify({data: data}));
                            window.alert("Server error adding round.");
                        });
                });
        };
        
    };

    
    AddTeeBoxController.$inject = ['$scope', '$routeParams', 'coursesFactory'];

    angular.module('golfApp')
        .controller('AddTeeBoxController', AddTeeBoxController);
    
}());