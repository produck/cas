const utils = require('./utils');

module.exports = function ProxyTicketProvider({ suffix, counter }) {
	return function ProxyTicket({
		proxyGrantingTicket,
		service,
		user,
		attributes
	}) {
		return {
			id: `PT-${counter.serviceTicket}-${utils.TicketBody()}-${suffix}`,
			proxyGrantingTicketId: proxyGrantingTicket.id,
			validated: false,
			createdAt: Date.now(),
			
			service: service,
			user: user,
			attributes: attributes,
			proxies: proxyGrantingTicket.proxies,
		};
	};
};