var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventsSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        eventType: String,
        dateTime: Date,
        courseId: Schema.Types.ObjectId,
        players: [ Schema.Types.ObjectId ],
        fees: Number,
        notes: String
    },
    {
        collection: 'events',
    }
);

var Events = mongoose.model('events', eventsSchema);
module.exports = Events;