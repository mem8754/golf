(function () {
    'use strict';
    var ViewCourseController = function ($scope, $routeParams, coursesFactory) {
        var courseId = $routeParams.courseId,
            tee = {};
        $scope.course = null;
        $scope.teeMessage = "";
        
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
    
    ViewCourseController.$inject = ['$scope', '$routeParams', 'coursesFactory'];

    angular.module('golfApp')
        .controller('ViewCourseController', ViewCourseController);
    
}());