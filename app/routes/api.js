var biometric = require('../controllers/biometricController');
var transaction = require('../controllers/transactionController');

module.exports = function(app){

	app.get('/api/biometrics', biometric.index);
	app.post('/api/biometrics', biometric.add);

	app.get('/api/transactions', transaction.test);
	app.post('/api/transaction', transaction.initialParse);
	app.post('/api/transaction/complete', transaction.completeParse);

}