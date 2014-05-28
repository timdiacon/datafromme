var Transaction = require('../models/Transaction');

module.exports = {
    index: function(req, res) {
        	
        Transaction.find({}, function(err, data) {
            res.json(data);
        });

    },

    add: function(req, res) {
        var o = new Transaction(req.body);
        o.user = req.user._id;

        o.save(function(err, doc) {
            if (err)
                res.json({});
            res.json(doc);
        });
    },
};
