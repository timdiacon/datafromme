var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    name: { type: String },
    twitter_id: { type: Number}
});

module.exports = {
    User: mongoose.model('User', UserSchema , "Users")
};
