var Transaction = require('../models/Transaction');
var fs = require('fs');

module.exports = {
    index: function(req, res) {
        	
        Transaction.find({}, function(err, data) {
            res.json(data);
        });

    },

    add: function(req, res) {
        fs.readFile(req.files.statement.path, function (err, data) {
            console.log("DATA:" + data);
        });
    }
};
