module.exports.initialize = function(app, passport) {
	app.get('/', function(request, response, next) {
	    response.render('index');
	});

	app.get('/profile', function(request, response, next){
		console.log("PROFILE");
		response.render('profile');
	});

	// Login
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/profile', failureRedirect: '/login' }));

	
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login')
	}
};
