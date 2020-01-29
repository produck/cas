const utils = require('./utils');

module.exports = function ServiceTicketProvider({ suffix, counter }) {
	return function ServiceTicket(ticketGrantTicket, service) {
		return {
			id: `ST-${counter.st++}-${utils.TicketBody()}-${suffix}`,
			ticketGrantTicketId: ticketGrantTicket.id,
			createdAt: Date.now(),
			visitedAt: Date.now(),
			uses: 0,
			validated: false,
			service: service.name
		};
	};
};