var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newEventSchema = new Schema(
    {
        eventType: String,
        dateTime: Date,
        courseId: Schema.Types.ObjectId,
        players: [ Schema.Types.ObjectId ],
        notes: String
    },
    {
        collection: 'events',
    }
);

var NewEvent = mongoose.model('newEvent', newEventSchema);
module.exports = NewEvent;