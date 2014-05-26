// app/models/biometric.js

var mongoose = require('mongoose');

var biometricSchema = mongoose.Schema({

	user: String, // storing ref to user here as other way around could inflate user document to 16mb with huge volumes of data
	date: Date,
	weight: Number

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Biometric', biometricSchema);