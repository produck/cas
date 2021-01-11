const DuckWebKoa = require('@produck/duck-web-koa');
const Router = require('@koa/router');
const bodyparser = require('koa-bodyparser');

const CredentialRequestor = require('./Handler/Credential/CredentialRequestor');
const CredentialAcceptor = require('./Handler/Credential/CredentialAcceptor');
const ServiceTicketIssuer = require('./Handler/Credential/ServiceTicketIssuer');

const ServiceTicketValidator = require('./Handler/Validator/ServiceTicketValidator');
const ResponseTransformer = require('./Handler/Validator/ResponseTransformer');
const ProxyGrantingTicketIssuer = require('./Handler/Validator/ProxyGrantingTicketIssuer');

const ProxyTicketIssuer = require('./Handler/ProxyTicketIssuer');
const TicketGrantingTicketResolver = require('./Handler/TicketGrantingTicketResolver');
const ServiceValidator = require('./Handler/ServiceValidator');
const SingleLogout = require('./Handler/SingleLogout');

function CasVersionSetter(versionNumber) {
	return ctx => ctx.state.cas = versionNumber;
}

module.exports = DuckWebKoa(function CasApplication(app, {
	injection, options, Extension
}) {
	const casRouter = new Router({ prefix: options.router.path });
	const authenticationRouter = new Router();
	const validationRouter = new Router();
	
	authenticationRouter
		.use(ServiceTicketIssuer(injection))
		.get('/login', CredentialRequestor(injection))
		.post('/login', CredentialAcceptor(injection));
	
	validationRouter
		.use(ResponseTransformer(injection))
		.use(ServiceTicketValidator(injection))
		.get('/validate', CasVersionSetter(1))
		.use(ProxyGrantingTicketIssuer(injection))
		.get('/serviceValidate', CasVersionSetter(2))
		.get('/proxyValidate', CasVersionSetter(2))
		.get('/p3/serviceValidate', CasVersionSetter(3))
		.get('/p3/proxyValidate', CasVersionSetter(3));
	
	casRouter
		.use(ServiceValidator(injection))
		.use(TicketGrantingTicketResolver(injection))
		.use(authenticationRouter.routes())
		.use(validationRouter.routes())
		.get('/logout', SingleLogout(injection))
		.get('/proxy', ProxyTicketIssuer(injection));
		
	app
		.use(bodyparser())
		.use(casRouter.routes())
		.use(Extension.router.routes());
});
