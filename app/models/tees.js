var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teesSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
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

var Tees = mongoose.model('tees', teesSchema);
module.exports = Tees;