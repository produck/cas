const utils = require('./utils');

module.exports = function LoginTicketProvider({ counter }) {
	return function LoginTicket() {
		return {
			id: `LT-${counter.lt++}-${utils.TicketBody()}`,
			validated: false,
			createdAt: Date.now(),
		};
	};
};
