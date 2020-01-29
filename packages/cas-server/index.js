const Koa = require('koa');
const Router = require('@koa/router');
const bodyparser = require('koa-bodyparser');

const CasRouter = require('./src/CasRouter');

exports.CasServer = function CasServer(options, factory) {
	const application = new Koa();
	const ticketRegistry = new TicketRegistry(options.Ticket);
	const serviceRegistry = new ServiceRegistry(options.Service);

	const router = new Router();
	const extensionRouter = new Router();
	const casRouter = CasRouter(ticketRegistry, serviceRegistry, {
		
	});

	factory(extensionRouter);

	router
		.use(casRouter.routes())
		.use(extensionRouter.routes());

	application
		.use(bodyparser())
		.use(router.routes());

	return {
		Callback() {
			return application.callback();
		}
	};
};