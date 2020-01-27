const Koa = require('koa');
const Router = require('@koa/router');
const bodyparser = require('koa-bodyparser');
const CasRouter = require('./src/CasRouter');

function TicketRegistry() {

}

function ServiceRegistry() {

}

exports.CasServer = function CasServer(options, factory) {
	const application = new Koa();
	const ticketRegistry = new TicketRegistry(options.Ticket);
	const serviceRegistry = new ServiceRegistry(options.Service);

	const casRouter = CasRouter(ticketRegistry, serviceRegistry, {
		
	});

	const extensionRouter = new Router();

	factory({
		application,
		router: extensionRouter
	});

	casRouter.use(extensionRouter.routes());

	application
		.use(bodyparser())
		.use(casRouter.routes());

	return {
		Callback() {
			return application.callback();
		}
	};
};