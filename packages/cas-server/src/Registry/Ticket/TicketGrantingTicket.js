const utils = require('./utils');

module.exports = function TicketGrantingTicketProvider({ suffix, counter }) {
	return function TicketGrantingTicket({
		user,
		attributes
	}) {
		return {
			id: `TGT-${counter.ticketGrantingTicket}-${utils.TicketBody()}-${suffix}`,
			createdAt: Date.now(),

			user: user,
			attributes: attributes,
		};
	};
};