/**
 * CAS Protocol 2.0 Specification
 * 
 * Author: Drew Mazurek
 * 
 * Version: 1.0
 * Release Date: May 4, 2005
 * Copyright © 2005, Yale University
 * 
 * https://apereo.github.io/cas/development/protocol/CAS-Protocol-V2-Specification.html#211-parameters
 */

/**
 * CAS Protocol 3.0 Specification
 * 
 * Author: Drew Mazurek
 * 
 * Version: 3.0.3
 * Release Date: 2017-12-01
 * Copyright © 2005, Yale University
 * Copyright © 2017, Apereo, Inc.
 * 
 * https://apereo.github.io/cas/6.1.x/protocol/CAS-Protocctxol-Specification.html#28-p3servicevalidate-cas-30
 */

// flagGroup --> handlerIndex
const FLAG_GROUP_TABLE = {
	'0,0,0,0': 1, '0,0,0,1': 1, '0,0,1,0': 1, '0,0,1,1': 1,
	'0,1,0,0': 1, '0,1,0,1': 2, '0,1,1,0': 1, '0,1,1,1': 1,
	'1,0,0,0': 0, '1,0,0,1': 0, '1,0,1,0': 1, '1,0,1,1': 1,
	'1,1,0,0': 2, '1,1,0,1': 2, '1,1,1,0': 1, '1,1,1,1': 1,
};

function binarizeFlagValue(value) {
	return value !== undefined ? 1 : 0;
}

module.exports = function CredentialRequestor(registry) {
	return async function requestor(ctx, next) {
		const { ticketGrantCookie } = ctx.state;
		const { renew, gateway, service } = ctx.query;

		const ticketGrantTicket = await registry.ticket.getTicketGrantTicketById(ticketGrantCookie);
		const authenticated = ticketGrantTicket !== null;

		const flagGroup = [authenticated, service, renew, gateway].map(binarizeFlagValue).join(',');
		const handlerIndex = FLAG_GROUP_TABLE[flagGroup];

		return [
			function alreadyLoggedIn() {
				ctx.state.data = {
					type: 'login.authenticated'
				};

				return next();
			},
			async function requestCredentials() {
				const loginTicket = await registry.ticket.createLoginTicket();
	
				ctx.state.data = {
					type: 'login.credential.request',
					loginTicket: loginTicket
				};

				return next();
			},
			async function issueServiceTicket() {
				if (ticketGrantTicket === null) {
					return ctx.redirect(service);
				}
	
				const ticketGrantTicketId = ticketGrantTicket.id;
				const serviceTicket = await registry.ticket.createServiceTicket(ticketGrantTicketId, service);

				return ctx.redirect(`${service}?ticket=${serviceTicket.id}`);
			}
		][handlerIndex]();
	};
};