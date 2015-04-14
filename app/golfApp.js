/*global angular */

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
            .when('/editTeeBox/:teeId', {
                controller: 'EditTeeBoxController',
                templateUrl: 'app/views/editTeeBox.html'
            })
            .when('/players', {
                controller: 'PlayersController',
                templateUrl: 'app/views/players.html'
            })
            .when('/playerDetails/:playerId', {
                controller: 'ViewPlayerController',
                templateUrl: 'app/views/viewPlayer.html'
            })
            .when('/addRound/:playerId', {
                controller: 'AddRoundController',
                templateUrl: 'app/views/addRound.html'
            })
            .when('/editRound/:roundId', {
                controller: 'EditRoundController',
                templateUrl: 'app/views/editRound.html'
            })
            .when('/events', {
                controller: 'EventsController',
                templateUrl: 'app/views/events.html'
            })
            .when('/addTeeTime', {
                controller: 'AddTeeTimeController',
                templateUrl: 'app/views/addTeeTime.html'
            })
            .when('/editTeeTime/:teeTimeId', {
                controller: 'EditTeeTimeController',
                templateUrl: 'app/views/editTeeTime.html'
            })
            .otherwise({ redirectTo: '/' });
    });
    
}());