const Cas = require('../index');

const server = Cas.Server({}, function factory(extRouter) {
	console.log(extRouter);
});