var models = require('../app/models');

module.exports = {

    findOrCreate: function(t_id, done){
        models.User.find({twitter_id: t_id}, null, null, function(err, docs){            
            console.log("Found:" + docs);
            return done(err, docs);
        })
    }
    
};
