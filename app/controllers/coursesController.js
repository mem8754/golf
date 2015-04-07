(function () {
    'use strict';
    var CoursesController = function ($scope, coursesFactory) {
        $scope.cSortBy = 'name';
        $scope.cReverse = false;
        $scope.courses = [];
        
        function init() {
            coursesFactory.getCourses()
                .success(function (courses) {
                    $scope.courses = courses;
                })
                .error(function (data, status, headers, config) {
                    console.log('Error on AJAX call for getCourses!');
                    console.log('Data: ' + data);
                    console.log('Status: ' + status);
                    console.log('Headers: ' + headers);
                    console.log('Config: ' + config);
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
    
    CoursesController.$inject = ['$scope', 'coursesFactory'];

    angular.module('golfApp')
        .controller('CoursesController', CoursesController);
    
}());