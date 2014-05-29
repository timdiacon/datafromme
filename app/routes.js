var biometric = require('./controllers/biometricController');
var transation = require('./controllers/transactionController');

module.exports.initialize = function(app, passport) {
	
	app.get('/', function(req, res, next) {
	    res.render('index', { user: req.user });
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', { user : req.user });
	});

	// Login
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' }));
	
	// Logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// API
	app.get('/api/biometrics', biometric.index);
	app.post('/api/biometrics', biometric.add);

	app.post('/api/transaction', transation.add);

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}