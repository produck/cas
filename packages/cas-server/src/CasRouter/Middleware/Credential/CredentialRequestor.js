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
const STRATEGY_FLAGGROUP_TABLE = {
	'0,0,0,0': 1, '0,0,0,1': 1, '0,0,1,0': 1, '0,0,1,1': 1,
	'0,1,0,0': 1, '0,1,0,1': 1, '0,1,1,0': 1, '0,1,1,1': 1,
	'1,0,0,0': 0, '1,0,0,1': 0, '1,0,1,0': 1, '1,0,1,1': 1,
	'1,1,0,0': 2, '1,1,0,1': 2, '1,1,1,0': 1, '1,1,1,1': 1,
};

function binarizeFlagValue(value) {
	return value !== undefined ? 1 : 0;
}

module.exports = function CredentialRequestor(Response) {
	return async function requestor(ctx, next) {
		const { ticketGrantTicket, service } = ctx.state;
		const { renew, gateway } = ctx.query;

		const flagGroup = [
			ticketGrantTicket !== null,
			service !== null,
			renew === 'true',
			gateway === 'true'
		].map(binarizeFlagValue).join(',');

		const strategy = STRATEGY_FLAGGROUP_TABLE[flagGroup];

		return [
			function authenticated() {
				return Response.authenticated(ctx);
			},
			function requestCredentials() {
				return Response.credentialRequested(ctx);
			},
			function issueServiceTicket() {
				return next();
			}
		][strategy]();
	};
};