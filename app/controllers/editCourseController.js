(function () {
    'use strict';
    var EditCourseController = function ($scope, $routeParams, coursesFactory, roundsFactory) {
        var courseId = $routeParams.courseId;
        $scope.course = null;
        $scope.cMsg1 = "";
        
        function init() {
            coursesFactory.getCourse(courseId)
                .error(function (data, status, headers, config) {
                    console.log('Error on AJAX call for getCourse: ', status);
                    console.log('Data: ' + data);
                    $scope.cMsg1 = "Server error reading course.";
                })
                .success(function (course) {
                    $scope.course = course;
                });
        }
        
        init();
        
        $scope.updateCourse = function () {
            coursesFactory.updateCourse($scope.course)
                .error(function (data, status, headers, config) {
                    console.log('Error updating Course: ', course.tag);
                    $scope.cMsg1 = "Server error updating course.";
                })
                .success(function (data) {
                    $scope.cMsg1 = "Course successfully updated.";
                });
        };
    };
    
    EditCourseController.$inject = ['$scope', '$routeParams', 'coursesFactory'];

    angular.module('golfApp')
        .controller('EditCourseController', EditCourseController);
    
}());