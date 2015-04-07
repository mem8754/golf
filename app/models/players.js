var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playersSchema = new Schema({
    _id: Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    hdcp: Number,
    ghinNo: String
});

var Players = mongoose.model('Players', playersSchema);
module.exports = Players;