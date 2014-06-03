// var Biometric = require('../models/Biometric');

// module.exports = {
//     index: function(req, res) {
        	
//         Biometric.find({}, function(err, data) {
//             res.json(data);
//         });

//     },

//     add: function(req, res) {
//         var newBiometric = new Biometric(req.body);
//         newBiometric.user = req.user._id;
//         newBiometric.date = new Date();

//         newBiometric.save(function(err, doc) {
//             if (err)
//                 res.json({});
//             res.json(doc);
//         });
//     },
// };
