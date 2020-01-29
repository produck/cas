const utils = require('./utils');

module.exports = function ProxyTicketProvider({ suffix, counter }) {
	return function ServiceTicket(ticketGrantTicket, service) {
		return {
			id: `PT-${counter.st++}-${utils.TicketBody()}-${suffix}`,
			ticketGrantTicketId: ticketGrantTicket.id,
			createdAt: Date.now(),
			validated: false,
			service: service.name
		};
	};
};