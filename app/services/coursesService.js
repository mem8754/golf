(function () {
    'use strict';
    var coursesService = function () {
        var courses = [
            {
                "_id": "54e36132e4b0e69a3d1e9e87",
                name: "Orange Tree Golf Club",
                street: "10601 North 56th St.",
                city: "Scottsdale",
                state: "AZ",
                zip: "85254",
                phone: "480.948.3730",
                hcp: [13, 1, 11, 15, 9, 5, 17, 3, 7, 12, 10, 16, 2, 14, 18, 4, 8, 6],
                par: [4, 5, 4, 3, 4, 5, 3, 4, 4, 4, 4, 3, 5, 4, 3, 4, 5, 4, 36, 36, 72],
                teeBoxes: [
                    {
                        teeName: "Middle",
                        courseRating: 69.0,
                        slopeRating: 117,
                        yds: [350, 480, 366, 153, 380, 466, 165, 403, 366,
                              379, 359, 180, 542, 383, 157, 375, 484, 383,
                              3129, 3242, 6371]
                    },
                    {
                        teeName: "Championship",
                        courseRating: 70.7,
                        slopeRating: 121,
                        yds: [362, 500, 380, 168, 394, 489, 216, 414, 376,
                              402, 408, 188, 578, 409, 188, 399, 501, 403,
                             3299, 3476, 6775]
                    }
                ]
            },
            {
                "_id": "54b75de563b83f9d40cadb37",
                "name": "TPC Champions",
                "street": "17020 N. Hayden Road",
                "city": "Scottsdale",
                "state": "AZ",
                "zip": "85255",
                "phone": "480.585.4334",
                "hcp": [16, 8, 18, 6, 2, 12, 14, 10, 4, 11, 7, 5, 17, 13, 15, 9, 3, 1],
                "par": [4, 4, 3, 5, 4, 3, 4, 3, 5, 5, 4, 4, 3, 4, 4, 3, 5, 4, 35, 36, 71],
                "teeBoxes": [
                    {
                        teeName: "White",
                        courseRating: 69.0,
                        slopeRating: 121,
                        yds: [323, 373, 134, 495, 385, 145, 355, 166, 516,
                              484, 433, 395, 117, 399, 313, 157, 552, 385,
                             2892, 3235, 6127]
                    },
                    {
                        "teeName": "Blue",
                        "courseRating": 71.3,
                        "slopeRating": 133,
                        "parTotal": 71,
                        "yds": [338, 428, 144, 521, 442, 188, 383, 191, 532,
                                514, 456, 423, 148, 410, 334, 189, 583, 429,
                               3167, 3486, 6653]
                    },
                    {
                        "teeName": "Black",
                        "courseRating": 73.7,
                        "slopeRating": 140,
                        "parTotal": 71,
                        "yds": [371, 461, 174, 556, 477, 202, 393, 212, 575,
                                542, 474, 446, 164, 429, 359, 215, 605, 460,
                               3421, 3694, 7115]
                    }
                ]
            },
            {
                "_id": "54b75de463b83f9d40cadb31",
                "name": "Troon North Monument",
                "street": "10320 E. Dynamite Blvd.",
                "city": "Scottsdale",
                "state": "AZ",
                "zip": "85262",
                "phone": "480.585.5300"
            },
            {
                "_id": "54b75de563b83f9d40cadb43",
                "name": "Troon North Pinnacle",
                "street": "10320 E. Dynamite Blvd.",
                "city": "Scottsdale",
                "state": "AZ",
                "zip": "85262",
                "phone": "480.585.5300"
            }
        ];
        
        this.getCourses = function () {
            return courses;
        };
        
        this.getCourse = function (courseId) {
            var i = 0;
            console.log('Searching for course ' + courseId);
            for (i = 0; i < courses.length; i++) {
                var getCourseId = courses[i]._id;
                console.log('Checking Course ID: ' + getCourseId);
                if (getCourseId === courseId) {
                    console.log('... found matching Course at index ' + i);
                    return courses[i];
                }
            }
        };
    };
    
    angular.module('golfApp').service('coursesService', coursesService);
    
}());