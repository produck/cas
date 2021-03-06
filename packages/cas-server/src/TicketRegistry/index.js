const { EventEmitter } = require('events');

const Provider = {
	LoginTicket: require('./LoginTicket'),
	TicketGrantingTicket: require('./TicketGrantingTicket'),
	ServiceTicket: require('./ServiceTicket'),
	ProxyGrantingTicket: require('./ProxyGrantingTicket'),
	ProxyTicket: require('./ProxyTicket')
};

module.exports = class TicketRegistry extends EventEmitter {
	constructor(options) {
		super();

		const { store, suffix, expiration } = options;

		const counter = {
			ticketGrantingTicket: 0,
			serviceTicket: 0,
			loginTicket: 0
		};
	
		const context = {
			suffix,
			counter: {
				get ticketGrantingTicket() {
					return counter.ticketGrantingTicket++;
				},
				get serviceTicket() {
					return counter.serviceTicket++;
				},
				get loginTicket() {
					return counter.loginTicket++;
				}
			}
		};
	
		this.isExpired = expiration;
		this.store = store;
		this.Ticket = {
			LoginTicket: Provider.LoginTicket(context),
			ServiceTicket: Provider.ServiceTicket(context),
			TicketGrantingTicket: Provider.TicketGrantingTicket(context),
			ProxyTicket: Provider.ProxyTicket(context),
			ProxyGrantingTicket: Provider.ProxyGrantingTicket(context)
		};
	}

	async createLoginTicket() {
		const ticket = this.Ticket.LoginTicket();

		await this.store.LoginTicket.create(ticket);

		return ticket;
	}
	
	async createServiceTicket(ticketGrantingTicketId, service, principal) {
		const ticketGrantingTicket = await this.store.TicketGrantingTicket.select(ticketGrantingTicketId);

		// if (ticketGrantingTicket === null || this.isExpired(ticketGrantingTicket)) {
		// 	throw new Error('Ticket granting ticket is invalid');
		// }

		const ticket = this.Ticket.ServiceTicket({ 
			ticketGrantingTicket,
			service,
			user: principal.user,
			attributes: principal.attributes
		});

		await this.store.ServiceTicket.create(ticket);

		return ticket;
	}
	
	async createTicketGrantingTicket(principal) {
		const ticket = this.Ticket.TicketGrantingTicket({
			user: principal.user,
			attributes: principal.attributes
		});

		await this.store.TicketGrantingTicket.create(ticket);

		return ticket;
	}
	
	async createProxyTicket(proxyGrantingTicketId, targetService, principal) {
		const proxyGrantingTicket = await this.store.ProxyGrantingTicket.select(proxyGrantingTicketId);

		const ticket = this.Ticket.ProxyTicket({
			proxyGrantingTicket,
			targetService,
			user: principal.user,
			attributes: principal.attributes,
			proxies: proxyGrantingTicket.proxies
		});

		await this.store.ProxyTicket.create(ticket);

		return ticket;
	}
	
	async createProxyGrantingTicket(principal, parentId) {
		const ticket = this.Ticket.ProxyGrantingTicket(principal, parentId);

		await this.store.ProxyGrantingTicket.create(ticket);

		return ticket;
	}

	async getTicketGrantingTicket(id) {
		const ticket = this.store.TicketGrantingTicket.select(id);

		return ticket ? ticket : null;
	}

	async getProxyGrantingTicket(id) {
		const ticket = this.store.ProxyGrantingTicket.select(id);

		return ticket ? ticket : null;
	}

	async getServiceTicket(id) {
		const ticket = this.store.ServiceTicket.select(id);

		return ticket ? ticket : null;
	}

	async getProxyTicket(id) {
		const ticket = this.store.ProxyTicket.select(id);

		return ticket ? ticket : null;
	}

	async getLoginTicket(id) {
		const ticket = this.store.ProxyTicket.select(id);

		return ticket ? ticket : null;
	}
	
	async destroyTicketGrantingTicket(ticketGrantingTicketId) {
		const ticket = await this.store.TicketGrantingTicket.delete(ticketGrantingTicketId);

		if (ticket) {
			this.emit('tgt::destroy', ticket);

			return ticket;
		}

		return null;
	}
};