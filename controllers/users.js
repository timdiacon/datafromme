var models = require('../app/models');

module.exports = {

    findByName: function(req, res) {
        var name = req.params.name;
        var skip = req.params.skip
        models.Record.find({Organisation_name: { $regex:name, $options: 'i' }},{},{limit:10, skip:skip}, function(err, data){
            if(err){
                res.json({error: 'Record not found.'});
            } else {
                res.json(data);
            }
        });
    }
    
};
