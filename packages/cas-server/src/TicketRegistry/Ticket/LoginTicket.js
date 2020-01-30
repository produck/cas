const utils = require('./utils');

module.exports = function LoginTicketProvider({ counter }) {
	return function LoginTicket() {
		return {
			id: `ST-${counter.lt++}-${utils.TicketBody()}`,
			createdAt: Date.now(),
			validated: false,
		};
	};
};
