const Router = require('@koa/router');

const CredentialRequestor = require('./Credential/CredentialRequestor');
const CredentialAcceptor = require('./Credential/CredentialAcceptor');
const ServiceTicketIssuer = require('./Credential/ServiceTicketIssuer');

const ServiceTicketValidator = require('./Validator/ServiceTicketValidator');
const ValidationTransformer = require('./Validator/ValidationTransformer');
const ProxyTicketValidator = require('./Validator/ProxyTicketValidator');

const TicketGrantTicketResolver = require('./TicketGrantTicketResolver');
const ServiceFilter = require('./ServiceFilter');
const SingleLogout = require('./SingleLogout');

function CasVersionSetter(casVersion) {
	return function setCasVersion(ctx, next) {
		ctx.state.cas = casVersion;

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

	validationRouter
		.use(ServiceTicketValidator(ticketRegistry))
		.get('/validate', CasVersionSetter(1), function cas10Response() {})
		.use(ProxyTicketValidator(ticketRegistry))
		.get('/serviceValidate', CasVersionSetter(2))
		.get('/proxyValidate', CasVersionSetter(2))
		.get('/p3/serviceValidate', CasVersionSetter(3))
		.get('/p3/proxyValidate', CasVersionSetter(3))
		.use(ValidationTransformer());

	casRouter
		.use(ServiceFilter(serviceRegistry))
		.use(TicketGrantTicketResolver(ticketRegistry))
		.use(authenticationRouter.routes())
		.use(validationRouter.routes())
		.get('/logout', SingleLogout(), options.singleLogout)
		.get('/proxy', function issuePGT() {});

	return casRouter;
};