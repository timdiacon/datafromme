module.exports = function(app, passport){

	// Login
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' }));

	// Logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

}