'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var MongoStore = require('connect-mongo')(express);
var app = express();

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var routes = require('./app/routes');
var configVars = require('./config/config.js');

var exphbs = require('express3-handlebars');
var hbs;
var databaseUrl;

/*
// Authentication module.
var auth = require('http-auth');
var basic = auth.basic({
    realm: "Top Secret",
    file: __dirname + "/htpasswd"
});

app.use(auth.connect(basic));
*/

// For gzip compression
app.use(express.compress());

// parse form data
app.use(express.bodyParser());

/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'staging') {
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
mongoose.connect(configVars.database.url);
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

// pass passport for configuration
require('./config/passport')(passport);

app.use(cookieParser());
app.use(session({
    secret: 'chrislovestheorangefive',
    store: new MongoStore({url:configVars.database.url})
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

routes.initialize(app, passport);

/*
 * Start it up
 */
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});