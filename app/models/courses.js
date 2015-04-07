var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var coursesSchema = new Schema({
    _id: Schema.Types.ObjectId,
    tag: String,
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    web: String,
    hcp: [],
    par: [],
},
{ collection: 'courses' });

var Courses = mongoose.model('courses', coursesSchema);
module.exports = Courses;