const utils = require('./utils');

module.exports = function ProxyTicketProvider({ suffix, counter }) {
	return function ServiceTicket(parentId, service) {
		return {
			id: `PGT-${counter.ticketGrantingTicket}-${utils.TicketBody()}-${suffix}`,
			parentId: parentId,
			service: service,
			createdAt: Date.now()
		};
	};
};