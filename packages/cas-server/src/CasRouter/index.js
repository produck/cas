const Router = require('@koa/router');

const CredentialRequestor = require('./Middleware/Credential/CredentialRequestor');
const CredentialAcceptor = require('./Middleware/Credential/CredentialAcceptor');
const ServiceTicketIssuer = require('./Middleware/Credential/ServiceTicketIssuer');

const ServiceTicketValidator = require('./Middleware/Validator/ServiceTicketValidator');
const ResponseTransformer = require('./Middleware/Validator/ResponseTransformer');
const ProxyGrantingTicketIssuer = require('./Middleware/Validator/ProxyGrantingTicketIssuer');

const ProxyTicketIssuer = require('./Middleware/ProxyTicketIssuer');
const TicketGrantingTicketResolver = require('./Middleware/TicketGrantingTicketResolver');
const ServiceFilter = require('./Middleware/ServiceValidator');
const SingleLogout = require('./Middleware/SingleLogout');

function CasVersionSetter(versionNumber) {
	return ctx => ctx.state.cas = versionNumber;
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
		.use(ResponseTransformer(serverContext))
		.use(ServiceTicketValidator(serverContext))
		.get('/validate', CasVersionSetter(1))
		.use(ProxyGrantingTicketIssuer(serverContext))
		.get('/serviceValidate', CasVersionSetter(2))
		.get('/proxyValidate', CasVersionSetter(2))
		.get('/p3/serviceValidate', CasVersionSetter(3))
		.get('/p3/proxyValidate', CasVersionSetter(3));

	casRouter
		.use(ServiceFilter(serverContext))
		.use(TicketGrantingTicketResolver(serverContext))
		.use(authenticationRouter.routes())
		.use(validationRouter.routes())
		.get('/logout', SingleLogout(serverContext))
		.get('/proxy', ProxyTicketIssuer(serverContext));

	return casRouter;
};