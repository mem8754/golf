/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';
    var EditCourseController = function ($scope, $window, $log, $routeParams, coursesFactory, roundsFactory) {
        var courseId = $routeParams.courseId;
        $scope.course = null;
        
        function init() {
            coursesFactory.getCourse(courseId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server error getting Course data: ', status);
                    $log.warn('Data: ' + data);
                })
                .success(function (course) {
                    $scope.course = course;
                });
        }
        
        init();
        
        $scope.updateCourse = function () {
            coursesFactory.updateCourse($scope.course)
                .error(function (data, status, headers, config) {
                    $log.warn('Error updating Course: ', status);
                    $log.warn("Data: ", data);
                    $window.alert("Server error updating course in database.");
                })
                .success(function (data) {
                    $window.alert("Course successfully updated.");
                });
        };
    };
    
    EditCourseController.$inject = ['$scope', '$window', '$log', '$routeParams', 'coursesFactory'];

    angular.module('golfApp')
        .controller('EditCourseController', EditCourseController);
    
}());