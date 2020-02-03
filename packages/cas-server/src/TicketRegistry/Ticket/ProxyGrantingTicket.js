const utils = require('./utils');

module.exports = function ProxyTicketProvider({ suffix, counter }) {
	return function ServiceTicket({
		parentGrantingTicket,
		service,
		user,
		attributes,
		proxies,
	}) {
		return {
			id: `PGT-${counter.ticketGrantingTicket}-${utils.TicketBody()}-${suffix}`,
			createdAt: Date.now(),

			service: service,
			user: user,
			attributes: attributes,
			
			parentGrantingTicketId: parentGrantingTicket.id,
			proxies: proxies,
		};
	};
};