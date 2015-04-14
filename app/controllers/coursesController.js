/*global angular */

(function () {
    'use strict';
    var CoursesController = function ($scope, $log, coursesFactory) {
        $scope.cSortBy = 'name';
        $scope.cReverse = false;
        $scope.courses = [];
        
        function init() {
            coursesFactory.getCourses()
                .success(function (courses) {
                    $scope.courses = courses;
                })
                .error(function (data, status, headers, config) {
                    $log.warn('Server error getting Courses: ', status);
                    $log.warn('Data: ' + data);
                });
        }
        
        init();
        
        $scope.doSort = function (propName) {
            if (propName === $scope.cSortBy) {
                $scope.cReverse = !$scope.cReverse;
            } else {
                $scope.cReverse = false;
                $scope.cSortBy = propName;
            }
        };
    };
    
    CoursesController.$inject = ['$scope', '$log', 'coursesFactory'];

    angular.module('golfApp')
        .controller('CoursesController', CoursesController);
    
}());