module.exports.initialize = function(app, passport) {
	app.get('/', function(request, response, next) {
	    response.render('index');
	});

	// Login
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));
};
