const utils = require('./utils');

module.exports = function ProxyTicketProvider({ suffix, counter }) {
	return function ServiceTicket(parentId) {
		return {
			id: `PGT-${counter.tgt++}-${utils.TicketBody()}-${suffix}`,
			parentId: parentId,
			createdAt: Date.now()
		};
	};
};