const utils = require('./utils');

module.exports = function ProxyTicketProvider({ suffix, counter }) {
	return function ServiceTicket(ticketGrantingTicket, service) {
		return {
			id: `PT-${counter.serviceTicket}-${utils.TicketBody()}-${suffix}`,
			ticketGrantingTicketId: ticketGrantingTicket.id,
			createdAt: Date.now(),
			validated: false,
			service: service.name
		};
	};
};