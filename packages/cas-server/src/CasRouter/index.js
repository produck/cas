const Router = require('@koa/router');

const CredentialRequestor = require('./Middleware/Credential/CredentialRequestor');
const CredentialAcceptor = require('./Middleware/Credential/CredentialAcceptor');
const ServiceTicketIssuer = require('./Middleware/Credential/ServiceTicketIssuer');

const ServiceTicketValidator = require('./Middleware/Validator/ServiceTicketValidator');
const ResponseTransformer = require('./Middleware/Validator/ResponseTransformer');
const ProxyTicketValidator = require('./Middleware/Validator/ProxyTicketValidator');

const TicketGrantingTicketResolver = require('./Middleware/TicketGrantingTicketResolver');
const ServiceFilter = require('./Middleware/ServiceFilter');
const SingleLogout = require('./Middleware/SingleLogout');

function CasVersionSetter(versionNumber) {
	return function setCasVersion(ctx, next) {
		ctx.state.cas = versionNumber;

		return next();
	};
}

module.exports = function CasKoaRouter({
	ticketRegistry,
	serviceRegistry,
	Principal,
	options
}) {
	const casRouter = new Router({
		prefix: options.prefix
	});

	const authenticationRouter = new Router();
	const validationRouter = new Router();

	authenticationRouter
		.get('/login', CredentialRequestor({
			ticketRegistry,
			authenticated(ctx) {

			},
			credentialRequested(ctx) {
				
			}
		}))
		.post('/login', CredentialAcceptor({
			ticketRegistry,
			async authenticate(credential) {
				const principal = await options.authenticate(credential);

				Principal.validate(principal);

				return principal;
			}
		}))
		.use(ServiceTicketIssuer({
			ticketRegistry
		}));

	const validateProxyTicket = ProxyTicketValidator(ticketRegistry);
	const setCas10 = CasVersionSetter(1);
	const setCas20 = CasVersionSetter(3);
	const setCas30 = CasVersionSetter(3);

	validationRouter
		.use(ServiceTicketValidator(ticketRegistry))
		.get('/validate', setCas10)
		.get('/serviceValidate', setCas20)
		.get('/p3/serviceValidate', setCas30)
		.get('/proxyValidate', setCas20, validateProxyTicket)
		.get('/p3/proxyValidate', setCas30, validateProxyTicket)
		.use(ResponseTransformer());

	casRouter
		.use(ServiceFilter(serviceRegistry))
		.use(TicketGrantingTicketResolver(ticketRegistry))
		.use(authenticationRouter.routes())
		.use(validationRouter.routes())
		.get('/logout', SingleLogout(), options.singleLogout)
		.get('/proxy', function issuePGT() {});

	return casRouter;
};