var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newTeeSchema = new Schema(
    {
        teeName: String,
        courseId: Schema.Types.ObjectId,
        rating: Number,
        slope: Number,
        yds: [Number]
    },
    {
        collection: 'tees'
    }
);

var NewTee = mongoose.model('newTee', newTeeSchema);
module.exports = NewTee;