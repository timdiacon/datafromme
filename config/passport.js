// load all the things we need
var TwitterStrategy  = require('passport-twitter').Strategy;

// load up the user model
var User = require('../app/models/user');

// load the auth variables
if(process.env.NODE_ENV == undefined){
    var configVars = require('./config');
    console.log(configVars);
}

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
        
    passport.use(new TwitterStrategy({
        consumerKey     : (process.env.NODE_ENV === 'staging') ? process.env.TWITTER_CONSUMER_KEY : configVars.twitter.consumerKey,
        consumerSecret  : (process.env.NODE_ENV === 'staging') ? process.env.TWITTER_CONSUMER_SECRET : configVars.twitter.consumerSecret,
        callbackURL     : (process.env.NODE_ENV === 'staging') ? process.env.TWITTER_CALLBACK_URL : configVars.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {

        // make the code asynchronous
	 	// User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {
            User.findOne({'twitter.id': profile.id }, function(err, user) {

                // TODO display error message if error occured
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
    
                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser = new User();
    
                    // set all of the user data that we need
                    newUser.twitter.id = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.username = profile.username;
                    newUser.twitter.displayName = profile.displayName;
                    newUser.twitter.profileImageUrl = profile._json.profile_image_url;
    
                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        
        });

    }));

};