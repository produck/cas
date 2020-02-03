const utils = require('./utils');

module.exports = function ServiceTicketProvider({ suffix, counter }) {
	return function ServiceTicket({
		ticketGrantingTicket,
		service,
		user,
		attributes
	}) {
		return {
			id: `ST-${counter.serviceTicket}-${utils.TicketBody()}-${suffix}`,
			ticketGrantingTicketId: ticketGrantingTicket.id,
			validated: false,
			createdAt: Date.now(),

			service: service,
			user: user,
			attributes: attributes,
		};
	};
};