const Koa = require('koa');
const Router = require('@koa/router');
const bodyparser = require('koa-bodyparser');

const TicketRegistry = require('./src/TicketRegistry');
const ServiceRegistry = require('./src/ServiceRegistry');
const PrincipalProvider = require('./src/Principal');

const CasRouter = require('./src/CasRouter');

function ServerContext(options) {
	const context =  {
		suffix: 'a',
		tgcName: 'CASTGC',
		Ticket: new TicketRegistry(options.Ticket),
		Service: new ServiceRegistry(options.Service),
		Principal: new PrincipalProvider(),
		extendAttributes: options.pirncipal.extender,
		Response: {
			AuthenticationFailure() {
	
			},
			AuthenticationSuccess() {
	
			},
			CredentialHolder() {

			},
			BadLoginTicket() {

			},
			Logout() {

			}
		},
		authenticate: options.authenticate,
	};

	return context;
}

exports.Server = function CasServer(options, factory = () => {}) {
	const context = ServerContext(options);

	const router = new Router();
	const extensionRouter = new Router();
	const casRouter = CasRouter(context);

	factory(extensionRouter);

	router
		.use(casRouter.routes())
		.use(extensionRouter.routes());

	const application = new Koa();

	application
		.use(bodyparser())
		.use(router.routes());

	return {
		Callback() {
			return application.callback();
		}
	};
};