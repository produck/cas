const utils = require('./utils');

module.exports = function ProxyTicketProvider({ suffix, counter }) {
	return function ServiceTicket() {
		return {
			id: `TGT-${counter.ticketGrantingTicket}-${utils.TicketBody()}-${suffix}`,
			createdAt: Date.now()
		};
	};
};