module.exports.initialize = function(app, passport) {
	
	// pull in other files
	require('./api')(app);
	require('./auth')(app, passport);
	require('./user')(app);
	
	app.get('/', function(req, res, next) {
		if(req.isAuthenticated()){
			res.render('dashboard', {user:req.user});
		} else {
	    	res.render('index');
		}
	});

};