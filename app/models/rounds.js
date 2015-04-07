var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roundsSchema = new Schema({
    date: Date,
    courseId: Schema.Types.ObjectId,
    playerId: Schema.Types.ObjectId,
    courseTag: String,
    teeIndex: Number,
    teeName: String,
    hdcpIndex: Number,
    grossScore: [Number],
    adjGrossScore: [Number],
    crsHdcp: Number,
    netScore: Number,
    hdcpDiff: Number
},
{ collection: 'rounds' }
);

var Rounds = mongoose.model('Rounds', roundsSchema);
module.exports = Rounds;