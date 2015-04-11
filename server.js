var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    app = express();

var credentials = require('./credentials.js');          /* database access credentials for MongoDB      */
var Courses = require('./app/models/courses.js');       /* schema for GETting  and PUTting course data  */
var NewCourse = require('./app/models/newCourse.js');   /* schema for POSTing a new course              */
var Players = require('./app/models/players.js');       /* schema for GETting player data               */
var Rounds = require('./app/models/rounds.js');         /* schema for GETting and PUTting round data    */
var Tees = require('./app/models/tees.js');             /* schema for GETting tee information           */
var NewTee = require('./app/models/newTee.js');         /* schema for POSTing a new tee box             */
var Events = require('./app/models/events.js');         /* schema for GETting event data                */
var NewEvent = require('./app/models/newEvent.js');      /* schema for POSTing new event data            */

app.set('port', process.env.PORT || 3000);

//===================================================================================
//  Connect to the database
//      Comment out either the localhost or the MongoLab connection string below:
//===================================================================================
//mongoose.connect(credentials.mongo.dbURI.local, credentials.mongo.dbOptions.local);              /* local mongodb   */
mongoose.connect(credentials.mongo.dbURI.remote, credentials.mongo.dbOptions.remote);            /* mongoLab        */

//===================================================================================
//  Middleware:
//===================================================================================

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// parse cookies with cookie-parser and cookieSecret
app.use(cookieParser(credentials.cookieSecret));

// set the static files location /public/img will be /img for users

app.use(express.static(__dirname + '/'));
//
//==============================================================================================
//  Route Handlers
//==============================================================================================

//==============================================================================================
//  Event-related routes:
//      /events/teeTimes/before - retrieves tee time events prior to a specific date/time
//      /events/teeTimes/after - retrieves tee time events subsequent to a specific date/time
//      /events/add - adds an event to the database (uses NewEvent Schema)
//==============================================================================================

//==============================================================================================
// "/events/teeTimes/before/:ref" route handler  
//==============================================================================================
app.get('/events/teeTimes/before/:ref', function (req, res) {
    'use strict';
    console.log('Route handler for /events/teeTimes/before');
    Events.find({eventType: "Tee Time", dateTime: { '$lt' : req.params.ref }}, function (err, events) {
        res.json(events);
    });
});

//==============================================================================================
// "/events/teeTimes/after/:ref" route handler  
//==============================================================================================
app.get('/events/teeTimes/after/:ref', function (req, res) {
    'use strict';
//    var timeNow = req.body.refTime;
    console.log('Route handler for /events/teeTimes/after: ', req.params);
    Events.find({eventType: "Tee Time", dateTime: { '$gt': req.params.ref } }, function (err, events) {
        res.json(events);
    });
});

//==============================================================================================
// "/events/add" route handler  
//==============================================================================================
app.post('/events/add', function (req, res) {
    'use strict';
    var event = req.body;
    console.log('Route handler for /events/add');
    console.log('Event: ', req.body);
    
    NewEvent.create(event, function (err, data) {
        if (err) {
            console.log("Mongoose error creating new event for " + req.body.eventType);
            console.log("Error: ", err);
            res.status(400);
            res.json({error: err});
        } else {
            console.log("Successfully added Event object: ", event);
            res.status(201);
            res.json(data);
        }
    });
});

app.get('/events/findDup', function(req, res) {
    'use strict';
    console.log('Route handler for /events/findDup');
    Events.find({ eventType: req.body.type, dateTime: req.body.date, courseId: req.body.crs }, function (err, events) {
        res.json(events);
    });

});

//==============================================================================================
//  Tee-related routes:
//      /tees/:teeId - retrieves a specific tee by ID
//      /tees/:courseId - retrieves all tees for a specific course
//==============================================================================================

//==============================================================================================
// "/tees/:teeId" route handler  
//==============================================================================================
app.get('/tees/:teeId', function (req, res) {
    'use strict';
    console.log('Route handler for /tees/:' + req.params.teeId);
    Tees.findById(req.params.teeId, function (err, tee) {
        res.json(tee);
    });
});

//==============================================================================================
// "/tees/:courseId" route handler  
//==============================================================================================
app.get('/teesByCourse/:courseId', function (req, res) {
    'use strict';
    console.log('Route handler for /teesByCourse/:' + req.params.courseId);
    Tees.find({ "courseId": req.params.courseId }, function (err, tees) {
        console.log('Returned tee data: ', tees);
        res.json(tees);
    });
});

//==============================================================================================
// "/updateTee/:id" PUT route handler
//==============================================================================================
app.put('/updateTee', function (req, res) {
    'use strict';
    var tee = new Tees(req.body);
    console.log('Route handler for /updateTee:', tee._id);

    Tees.findByIdAndUpdate(tee._id, req.body, function (err, data) {
        if (err) {
            console.log("Mongoose error updating tee: ", req.params.id);
            console.log("Error: ", err);
            res.status(400);
            res.json({error: err});
        } else {
            console.log("Successfully updated tee: ", tee);
            console.log("Returned data: ", data);
            res.status(201);
            res.json(data);
        }
        
    });
});

//==============================================================================================
// "/addTee" POST route handler  
//==============================================================================================
app.post('/addTee', function (req, res) {
    'use strict';
    var tee = req.body;
    console.log('Route handler for POST /addTee');
    console.log('Tee: ', req.body);
 
    NewTee.create(tee, function (err, data) {
        if (err) {
            console.log("Mongoose error creating new tee for " + req.body.teeName);
            console.log("Error: ", err);
            res.status(400);
            res.json({error: err});
        } else {
            console.log("Successfully added Tee object: ", tee);
            res.status(201);
            res.json(data);
        }
    });
});

//==============================================================================================
//  Player-related routes:
//      /players - retrieves all players
//      /players/names - retrieves player names (first and last) for all players
//      /players/:playerId - retrieves specific player
//      /players/hcp/:playerId - retrieves player handicap index
//==============================================================================================
// "/players" route handler  
//==============================================================================================
app.get('/players', function (req, res) {
    'use strict';
    console.log('Route handler for /players');
    Players.find({}, function (err, players) {
        res.json(players);
    });
});

//==============================================================================================
// "/players/names" route handler
//==============================================================================================

app.get('/players/names', function (req, res) {
    'use strict';
    console.log('Route handler for /players/names');
    Players.find({}, { _id: 1, firstName: 1, lastName: 1 }, function (err, names) {
        res.json(names);
    });
});

//==============================================================================================
// "/players/:playerId" route handler  
//==============================================================================================

app.get('/players/:playerId', function (req, res) {
    'use strict';
    console.log('Route handler for /players/:', req.params.playerId);
    Players.findById(req.params.playerId, function (err, player) {
        res.json(player);
    });
});

//==============================================================================================
// "/players/hcp/:playerId" route handler  
//==============================================================================================

app.get('/player/hcp/:playerId', function (req, res) {
    'use strict';
    console.log('Get Route handler for /players/hcp/:', req.params.playerId);
    Players.findById(req.params.playerId, { _id: 1, lastName: 1, firstName: 1, hdcp: 1 }, function (err, data) {
        res.json(data);
    });
});

app.put('/player/hcp/:playerId', function (req, res) {
    'use strict';
    console.log('Put Route handler for /players/hcp/:', req.params.playerId);
    console.log('Body: ', req.body);
    Players.update({ _id: req.params.playerId }, { $set: { hdcp: req.body.hdcp }}, function (err, data) {
        res.json(data);
    });
});

//==============================================================================================
//  Course-related routes:
//      /courses - retrieves all courses
//      /courses/names = retrieves all course tags
//      /courses/:courseId - retrieves specific course
//      /courses/id/:courseTag - retrieve course ID (and name) given course Tag
//      /courses/hcp/:courseId - retrieves course rating and slope rating for specified course
//      /courses/addCourse - POST call to add a course to the database (using NewCourse schema)
//==============================================================================================

//==============================================================================================
// "/courses" route handler  
//==============================================================================================

app.get('/courses', function (req, res) {
    'use strict';
    console.log('Route handler for /courses');
    Courses.find({}, function (err, courses) {
        res.json(courses);
    });
});

//==============================================================================================
// "/courses/names" route handler
//==============================================================================================

app.get('/courses/names', function (req, res) {
    'use strict';
    console.log('Route handler for /courses/names');
    Courses.find({}, { _id: 1, tag: 1 }, function (err, tags) {
        res.json(tags);
    });
});

//==============================================================================================
// "/courses/:courseId" route handler  
//==============================================================================================
app.get('/courses/:courseId', function (req, res) {
    'use strict';
    console.log('Route handler for /courses/:' + req.params.courseId);
    Courses.findById(req.params.courseId, function (err, course) {
//        console.log('Returned course data: ', course);
        res.json(course);
    });
});

//==============================================================================================
// "/courses/id/:courseTag" route handler  
//==============================================================================================
app.get('/courses/id/:courseTag', function (req, res) {
    'use strict';
    console.log('Route handler for /courses/id/:' + req.params.courseTag);
    Courses.findOne({ tag: req.params.courseTag }, { _id: 1, name: 1 }, function (err, data) {
        if (err) {
            console.log("Mongoose error querying course tag");
            console.log("Error: ", err);
            res.status(400);
            res.json({error: err});
        } else {
            console.log("Returned data: ", data);
            res.status(201);
            res.json(data);
        }
    });
});

//==============================================================================================
// "/courses/hcp/:courseId" route handler  
//==============================================================================================
app.get('/courses/hcp/:courseId', function (req, res) {
    'use strict';
    console.log('Route handler for /courses/hcp/:' + req.params.courseId);
    Courses.findById(req.params.courseId, { _id: 1, tag: 1, par: 1 }, function (err, course) {
        if (err) {
            console.log("Mongoose error querying course hcp data");
            console.log("Error: ", err);
            res.status(400);
            res.json({error: err});
        } else {
            res.status(201);
            res.json(course);
        }
    });
});

//==============================================================================================
// "/courses/addCourse" POST route handler  
//==============================================================================================
app.post('/courses/addCourse', function (req, res) {
    'use strict';
    var course = req.body;
    console.log('Route handler for POST /courses/addCourse');
    console.log('Course: ', course);
 
    NewCourse.create(course, function (err, data) {
        if (err) {
            console.log("Mongoose error creating new course for " + req.body.tag);
            console.log("Error: ", err);
            res.status(400);
            res.json({error: err});
        } else {
            console.log("Successfully added new Course object: ", course.tag);
            res.status(201);
            res.json(data);
        }
    });
});

//==============================================================================================
// "/courses/updateCourse" PUT route handler
//==============================================================================================
app.put('/courses/updateCourse', function (req, res) {
    'use strict';
    var course = new Courses(req.body);
    console.log('Route handler for /courses/updateCourse');

    Courses.findByIdAndUpdate(course._id, course, function (err, data) {
        if (err) {
            console.log("Mongoose error updating course: ", course._id, " / ", course.tag);
            console.log("Error: ", err);
            res.status(400);
            res.json({error: err});
        } else {
            console.log("Successfully updated course: ", course);
            console.log("Returned data: ", data);
            res.status(201);
            res.json(data);
        }
        
    });
});

//==============================================================================================
//  Round-related routes:
//      /rounds - retrieves all rounds (all players, courses, dates). Used for troubleshooting.
//      /rounds/:playerId - retrieves rounds for specific player
//      /rounds/:courseId - retrieves rounds for specific course
//      /rounds/:date - retrieves rounds for specific date
//      /round/:roundId - retrieves specific round
//      /postRound - posts a new round in the database
//      /putRound - updates an existing round in the database
//==============================================================================================

//==============================================================================================
// "/updateRound" PUT route handler
//==============================================================================================
app.put('/updateRound/:id', function (req, res) {
    'use strict';
    var round = new Rounds(req.body);
    console.log('Route handler for /updateRound/', req.params.id);

    Rounds.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
        if (err) {
            console.log("Mongoose error updating round: ", req.params.id);
            console.log("Error: ", err);
            res.status(400);
            res.json({error: err});
        } else {
            console.log("Successfully updated round: ", round);
            console.log("Returned data: ", data);
            res.status(201);
            res.json(data);
        }
        
    });
});

//==============================================================================================
// "/addRound" POST route handler  
//==============================================================================================
app.post('/addRound', function (req, res) {
    'use strict';
    var round = req.body;
    console.log('Route handler for POST /addRound');
    console.log('Round: ', req.body);
 
    Rounds.create(round, function (err, data) {
        if (err) {
            console.log("Mongoose error creating new round for " + req.body.courseTag);
            console.log("Error: ", err);
            res.status(400);
            res.json({error: err});
        } else {
            console.log("Successfully added Round object: ", round);
            res.status(201);
            res.json(data);
        }
    });
});

//==============================================================================================
// "/rounds/player/:playerId" GET route handler  
//==============================================================================================
app.get('/rounds/player/:playerId', function (req, res) {
    'use strict';
    var rounds = [];
    console.log('Route handler for /rounds/:playerId' + req.params.playerId);
    Rounds.find({ "playerId": req.params.playerId }, function (err, rounds) {
        res.json(rounds);
    });
});

//==============================================================================================
// "/rounds/course/:courseId" GET route handler  
//==============================================================================================
app.get('/rounds/course/:courseId', function (req, res) {
    'use strict';
    var rounds = [];
    console.log('Route handler for /rounds/course/:courseId' + req.params.playerId);
    Rounds.find({ "courseId": req.params.courseId }, function (err, rounds) {
        res.json(rounds);
    });
});

//==============================================================================================
// "/rounds/date/:date" GET route handler  
//==============================================================================================
app.get('/rounds/date/:date', function (req, res) {
    'use strict';
    var rounds = [];
    console.log('Route handler for /rounds/date/:date' + req.params.date);
    Rounds.find({ "date": req.params.date }, function (err, rounds) {
        res.json(rounds);
    });
});

//==============================================================================================
// "/round/:roundId" GET route handler  
//==============================================================================================
app.get('/round/:roundId', function (req, res) {
    'use strict';
    console.log('Route handler for /round/:roundId: ', req.params.roundId);
    Rounds.findById(req.params.roundId, function (err, round) {
        res.json(round);
    });
});


//==============================================================================================
// Start listening on assigned port for application requests.
//==============================================================================================
app.listen(app.get('port'), function () {
    'use strict';
    console.log('Express on port ', app.get('port'), '; Ctrl-C to terminate ...');
});