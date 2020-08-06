var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://127.0.0.1/fusionwebredesign', {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true
});

mongoose.Promise = Promise;


module.exports.Sample = require('./sample');
module.exports.Pack = require('./pack');
module.exports.User = require('./user');
module.exports.Collection = require('./collection');