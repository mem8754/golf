(function () {
    'use strict';
    var AddCourseController = function ($scope, coursesFactory) {
        $scope.course = {};
        
        function init() {
            $scope.cmsg1 = "Enter course specifics, then press the \'Add\' button.";
        }
   
        init();
        
        /*  Add a course through the "courses" Factory */
        
        $scope.addCourse = function () {
            var i = 0,
                course = $scope.course;
            $scope.cmsg1 = "";
            $scope.cmsg2 = "";
            $scope.cmsg3 = "";
            if (course.tag === undefined) {
                $scope.cmsg1 = "Course Tag cannot be blank, please enter a tag.";
                return;
            }
            console.log('Adding Course', $scope.course.tag);
                
//
//==========================================================================================
//  Steps to add course:
//      1.  Query DB for user-provided "courseTag" parameter to confirm course does not exist
//      2.  Create the new course from the data entererd.
//==========================================================================================
            coursesFactory.getCourseId(course.tag)
                .error(function (data, status, headers, config) {
                    console.log("Add Course - error on database read: ", JSON.stringify({data: data}));
                    $scope.cmsg1 = "Error reading database.";
                })
                .success(function (existingCourse) {
                    if (existingCourse !== null) {
                        $scope.cmsg1 = "Specified course already exists, please enter a new course.";
                        return;
                    }
                    
                    course.par[18] = course.par[19] = course.par[20] = 0;
                    for (i = 0; i < 9; i += 1) {
                        course.par[18] += course.par[i];
                        course.par[19] += course.par[i + 9];
                    }
                    course.par[20] = course.par[18] + course.par[19];
                
                    coursesFactory.addCourse(course)
                        .error(function (data, status, headers, config) {
                            console.log("Add Course - error adding course.", JSON.stringify({data: data}));
                            $scope.cmsg1 = "Error adding entered course.";
                            return;
                        })
                        .success(function (tees) {
                            $scope.cmsg1 = "Course successfully added to database.";
                        });
                });
        };
        
    };

    
    AddCourseController.$inject = ['$scope', 'coursesFactory'];

    angular.module('golfApp')
        .controller('AddCourseController', AddCourseController);
    
}());