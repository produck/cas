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
const CasError = require('./IssuerErrors');

module.exports = function CredentialRequestor() {
	return async function requestor(ctx) {
		const { ticketGrantingTicket } = ctx.state;
		const { renew, gateway } = ctx.query;
		
		ctx.state.primary = false;

		if (gateway && !renew) {
			throw CasError.GatewayWithoutTicket();
		}

		if (ticketGrantingTicket === null || renew) {
			throw CasError.CredentialRequired();
		}
	};
};