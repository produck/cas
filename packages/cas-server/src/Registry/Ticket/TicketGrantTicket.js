const utils = require('./utils');

module.exports = function ProxyTicketProvider({ suffix, counter }) {
	return function ServiceTicket() {
		return {
			id: `TGT-${counter.tgt++}-${utils.TicketBody()}-${suffix}`,
			createdAt: Date.now()
		};
	};
};