'use strict';

/*
 * Express Dependencies
 */
var express = require('express'),
    app = express(),
    port = 3000,
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    CONSUMERKEY = "N69Y30HwVPXYk2TdgXtMQVs5C",
    CONSUMERSECRET = "7L47WHvdLv0BKQQGRUaeNkP14mHlCQtJkWHhmWFfHwjs6jb5BY",
    twitterCallbackURL = "http://localhost:3000/auth/twitter/callback",
    mongoose = require('mongoose'),
    database = 'publicReg';
/*
 * Use Handlebars for templating
 */
var exphbs = require('express3-handlebars');
var hbs;

// For gzip compression
app.use(express.compress());

/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'production') {
    // Set the default layout and locate layouts and partials
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: 'dist/views/layouts/',
        partialsDir: 'dist/views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/dist/views');
    
    // Locate the assets
    app.use(express.static(__dirname + '/dist/assets'));

} else {
    app.engine('handlebars', exphbs({
        // Default Layout and locate layouts and partials
        defaultLayout: 'main',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/views');
    
    // Locate the assets
    app.use(express.static(__dirname + '/assets'));
}

// Set Handlebars
app.set('view engine', 'handlebars');

//connect to the db server:
mongoose.connect('mongodb://localhost/' + database);
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

// cookies and sessions for user tracking
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

/* Passport for user login */
// TEMP
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
//
app.use(passport.initialize());
app.use(passport.session());
passport.use(new TwitterStrategy({
    consumerKey: CONSUMERKEY,
    consumerSecret: CONSUMERSECRET,
    callbackURL: twitterCallbackURL
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
    // TODO - not sure if needs to live within tick but anyway need to run a FindOrCreate function with returned profile
      console.log(profile);
    });
  }
));

/*
 * Routes
 */
// Index Page
app.get('/', function(request, response, next) {
    response.render('index');
});

// Login
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);