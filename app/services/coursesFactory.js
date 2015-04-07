(function () {
    'use strict';
    var coursesFactory = function ($http) {
        
        var factory = {};
//            courses = null;
            
        factory.getCourses = function () {
            return $http.get('/courses');
        };
        
        factory.getCourse = function (courseId) {
            return $http.get('/courses/' + courseId);
        };
        
        factory.getTees = function (courseId) {
            return $http.get('/teesByCourse/' + courseId);
        };

        factory.getCourseId = function (courseTag) {
            return $http.get('/courses/id/' + courseTag);
        };
        
        factory.addTee = function (tee) {
            console.log('coursesFactory addTee: ', tee);
            return $http.post('/addTee', tee);
        };

        factory.getCourseHdcp = function (courseId) {
            return $http.get('/courses/hcp/' + courseId);
        };
        factory.addCourse = function (course) {
            console.log('courseFactory addCourse: ', course);
            return $http.post('/courses/addCourse', course);
        };
        factory.updateCourse = function (course) {
            console.log('coursesFactory updateCourse: ', course);
            return $http.put('/courses/updateCourse', course);
        };
        
        
        return factory;
    };
    
    coursesFactory.$inject = ['$http'];
    
    angular.module('golfApp').factory('coursesFactory', coursesFactory);
    
}());