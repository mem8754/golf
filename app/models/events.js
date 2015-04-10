var mongoose = require('mongoose');

var eventsSchema = new mongoose.Schema(
    {
        _id: Schema.Types.ObjectId,
        eventType: String,
        dateTime: Date,
        courseId: mongoose.Schema.types.ObjectId,
        players: [mongoose.Schema.types.ObjectId],
        notes: String
    },
    {
        collection: 'events',
    }
);

var Events = mongoose.model('events', eventsSchema);
module.exports = Events;