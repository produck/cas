
const Router = require('@koa/router');

module.exports = class ExtensionManager {
	constructor() {
		this.router = new Router();
	}

	appendRouter(callback) {
		const router = new Router();

		callback(router);

		this.router.use(router.routes());
	}
};
