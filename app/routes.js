//var biometric = require('./controllers/biometricController');
var transation = require('./controllers/transactionController');

module.exports.initialize = function(app, passport) {
	
	app.get('/', function(req, res, next) {
		if(req.isAuthenticated()){
			res.render('dashboard', {user:req.user});
		} else {
	    	res.render('index');
		}
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
	//app.get('/api/biometrics', biometric.index);
	//app.post('/api/biometrics', biometric.add);

	app.post('/api/transaction', transation.initialParse);
	app.post('/api/transaction/complete', transation.completeParse);

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}