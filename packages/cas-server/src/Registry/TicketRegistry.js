const Provider = {
	LoginTicket: require('./Ticket/LoginTicket'),
	TicketGrantTicket: require('./Ticket/TicketGrantTicket'),
	ServiceTicket: require('./Ticket/ServiceTicket'),
	ProxyGrantTicket: require('./Ticket/ProxyGrantTicket'),
	ProxyTicket: require('./Ticket/ProxyTicket')
};

module.exports = function TicketRegistry(options) {
	const { store, suffix, expiration } = options;

	const context = {
		suffix,
		counter: { tgt: 0, st: 0, lt: 0 }
	};

	const Ticket = {
		LoginTicket: Provider.LoginTicket(context),
		ServiceTicket: Provider.ServiceTicket(context),
		TicketGrantTicket: Provider.TicketGrantTicket(context),
		ProxyTicket: Provider.ProxyTicket(context),
		ProxyGrantTicket: Provider.ProxyGrantTicket(context)
	};

	return {
		async createLoginTicket() {
			const ticket = Ticket.LoginTicket();

			await store.LoginTicket.create(ticket);

			return ticket;
		},
		async createServiceTicket(ticketGrantTicketId, service) {
			const ticketGrantTicket = await store.TicketGrantTicket.select(ticketGrantTicketId);
			const ticket = Ticket.ServiceTicket(ticketGrantTicketId, service);

			await store.ServiceTicket.create(ticket);

			return ticket;
		},
		async createTicketGrantTicket() {
			const ticket = Ticket.TicketGrantTicket();

			await store.TicketGrantTicket.create(ticket);

			return ticket;
		},
		async createProxyTicket(proxyGrantTicketId, service) {
			const ticket = Ticket.ProxyTicket(proxyGrantTicketId, service);

			await store.ProxyTicket.create(ticket);

			return ticket;
		},
		async createProxyGrantTicket(parentId) {
			const ticket = Ticket.ProxyGrantTicket(parentId);

			await store.ProxyGrantTicket.create(ticket);

			return;
		},

	};
};