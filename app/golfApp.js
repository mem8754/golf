(function () {
    'use strict';
    var app = angular.module('golfApp', ['ngRoute', 'ngSanitize', 'ui.select']);
    
    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/home.html'
            })
            .when('/courses', {
                controller: 'CoursesController',
                templateUrl: 'app/views/courses.html'
            })
            .when('/addCourse', {
                controller: 'AddCourseController',
                templateUrl: 'app/views/addCourse.html'
            })
            .when('/editCourse/:courseId', {
                controller: 'EditCourseController',
                templateUrl: 'app/views/editCourse.html'
            })
            .when('/viewCourse/:courseId', {
                controller: 'ViewCourseController',
                templateUrl: 'app/views/viewCourse.html'
            })
            .when('/addTeeBox/:courseId', {
                controller: 'AddTeeBoxController',
                templateUrl: 'app/views/addTeeBox.html'
            })
            .when('/players', {
                controller: 'PlayersController',
                templateUrl: 'app/views/players.html'
            })
            .when('/rounds/:playerId', {
                controller: 'PlayerDetailsController',
                templateUrl: 'app/views/rounds.html'
            })
            .when('/addRound/:playerId', {
                controller: 'AddRoundController',
                templateUrl: 'app/views/addRound.html'
            })
            .when('/editRound/:roundId', {
                controller: 'EditRoundController',
                templateUrl: 'app/views/editRound.html'
            })
            .when('/schedule', {
                templateUrl: 'app/views/schedule.html'
            })
            .otherwise({ redirectTo: '/' });
    });
    
}());