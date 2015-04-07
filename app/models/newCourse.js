var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newCourseSchema = new Schema({
    tag: String,
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    hcp: [],
    par: []
},
{ collection: 'courses' }
);

var NewCourse = mongoose.model('newCourse', newCourseSchema);
module.exports = NewCourse;