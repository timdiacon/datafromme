if(process.env.NODE_ENV === 'development'){
	configSrc = require('./localSettings')
} else {
	configSrc = process.env 
}

module.exports = {

	'database': {
		'url': configSrc.DATABASE
	},

	'twitter': {
		'consumerKey' : configSrc.TWITTER_CONSUMER_KEY,
		'consumerSecret' : configSrc.TWITTER_CONSUMER_SECRET,
		'callbackURL' : configSrc.TWITTER_CALLBACK_URL,
	}
}