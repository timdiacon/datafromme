var Biometric = require('../models/biometric');

module.exports = {
    index: function(req, res) {
        	
        Biometric.find({}, function(err, data) {
            res.json(data);
        });

    }
};
