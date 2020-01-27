const Router = require('@koa/router');

const CredentialRequestor = require('./Credential/CredentialRequestor');
const CredentialAcceptor = require('./Credential/CredentialAcceptor');
const ServiceTicketIssuer = require('./Credential/ServiceTicketIssuer');

const ServiceTicketValidator = require('./Validator/ServiceTicketValidator');
const ValidationTransformer = require('./Validator/ValidationTransformer');
const ProxyTicketValidator = require('./Validator/ProxyTicketValidator');
const Cas30PrincipalAttributes = require('./Validator/Cas30PrincipalAttributes');

const TicketGrantTicketResolver = require('./TicketGrantTicketResolver');
const ServiceFilter = require('./ServiceFilter');
const SingleLogout = require('./SingleLogout');

module.exports = function CasKoaRouter(ticketRegistry, serviceRegistry, options) {
	const registry = {
		ticket: ticketRegistry,
		service: serviceRegistry
	};

	const serviceFilter = ServiceFilter(registry, options);
	const ticketGrantTicketResolver = TicketGrantTicketResolver(registry, options);

	const credentialRequestor = CredentialRequestor(registry, options);
	const credentialAcceptor = CredentialAcceptor(registry, options);
	const issueST = ServiceTicketIssuer(registry, options);

	const ptValidator = ProxyTicketValidator(registry, options);
	const stValidator = ServiceTicketValidator(registry, options);
	const formatBody = ValidationTransformer(registry, options);
	const setAttributes = Cas30PrincipalAttributes(registry, options);

	return new Router({ prefix: options.prefix })
		.use(serviceFilter)
		.use(ticketGrantTicketResolver)
		.get('/logout', SingleLogout(registry, options), options.singleLogout)
		.get('/login', credentialRequestor, issueST)
		.post('/login', credentialAcceptor, issueST)
		.get('/serviceValidate', stValidator, formatBody)
		.get('/proxyValidate', stValidator, ptValidator, formatBody)
		.get('/p3/serviceValidate', stValidator, setAttributes, formatBody)
		.get('/p3/proxyValidate', stValidator, ptValidator, setAttributes, formatBody)
		.get('/proxy', )
		.get('/validate', stValidator, function cas10Response() {

		});
};