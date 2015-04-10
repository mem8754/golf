(function () {
    'use strict';
    var coursesFactory = function ($http, $log) {
        
        var factory = {};
//            courses = null;
            
        factory.getCourses = function () {
            return $http.get('/courses');
        };
        
        factory.getCourseNames = function () {
            return $http.get('/courses/names');
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
            $log.log('coursesFactory addTee: ', tee);
            return $http.post('/addTee', tee);
        };
        
        factory.getTee = function (teeId) {
            $log.log('coursesFactory getTee: ', teeId);
            return $http.get('/tees/' + teeId);
        };
        
        factory.updateTee = function (tee) {
            $log.log('coursesFactory updateTee: ', tee);
            return $http.put('/updateTee', tee);
        };

        factory.getCourseHdcp = function (courseId) {
            return $http.get('/courses/hcp/' + courseId);
        };
        factory.addCourse = function (course) {
            $log.log('courseFactory addCourse: ', course);
            return $http.post('/courses/addCourse', course);
        };
        factory.updateCourse = function (course) {
            $log.log('coursesFactory updateCourse: ', course);
            return $http.put('/courses/updateCourse', course);
        };
        
        
        return factory;
    };
    
    coursesFactory.$inject = ['$http', '$log'];
    
    angular.module('golfApp').factory('coursesFactory', coursesFactory);
    
}());