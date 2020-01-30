const utils = require('./utils');

module.exports = function ServiceTicketProvider({ suffix, counter }) {
	return function ServiceTicket(ticketGrantingTicket, service) {
		return {
			id: `ST-${counter.serviceTicket}-${utils.TicketBody()}-${suffix}`,
			ticketGrantingTicketId: ticketGrantingTicket.id,
			createdAt: Date.now(),
			validated: false,
			service: service.name
		};
	};
};