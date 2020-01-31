const Router = require('@koa/router');

const CredentialRequestor = require('./Middleware/Credential/CredentialRequestor');
const CredentialAcceptor = require('./Middleware/Credential/CredentialAcceptor');
const ServiceTicketIssuer = require('./Middleware/Credential/ServiceTicketIssuer');

const ServiceTicketValidator = require('./Middleware/Validator/ServiceTicketValidator');
const ResponseTransformer = require('./Middleware/Validator/ResponseTransformer');
const ProxyTicketValidator = require('./Middleware/Validator/ProxyTicketValidator');

const ProxyGrantingTicketIssuer = require('./Middleware/ProxyGrantingTicketIssuer');
const TicketGrantingTicketResolver = require('./Middleware/TicketGrantingTicketResolver');
const ServiceFilter = require('./Middleware/ServiceValidator');
const SingleLogout = require('./Middleware/SingleLogout');

function CasVersionSetter(versionNumber) {
	return function setCasVersion(ctx, next) {
		ctx.state.cas = versionNumber;

		return next();
	};
}

module.exports = function CasKoaRouter(serverContext) {
	const casRouter = new Router();
	const authenticationRouter = new Router();
	const validationRouter = new Router();

	authenticationRouter
		.use(ServiceTicketIssuer(serverContext))
		.get('/login', CredentialRequestor(serverContext))
		.post('/login', CredentialAcceptor(serverContext));

	validationRouter
		.use(ResponseTransformer())
		.use(ServiceTicketValidator(serverContext))
		.use(ProxyTicketValidator(serverContext))
		.get('/validate', CasVersionSetter(1))
		.get('/serviceValidate', CasVersionSetter(2))
		.get('/p3/serviceValidate', CasVersionSetter(3))
		.get('/proxyValidate', CasVersionSetter(2))
		.get('/p3/proxyValidate', CasVersionSetter(3));

	casRouter
		.use(ServiceFilter(serverContext))
		.use(TicketGrantingTicketResolver(serverContext))
		.use(authenticationRouter.routes())
		.use(validationRouter.routes())
		.get('/logout', SingleLogout(serverContext))
		.get('/proxy', ProxyGrantingTicketIssuer(serverContext));

	return casRouter;
};