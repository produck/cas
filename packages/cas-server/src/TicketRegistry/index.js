const EventEmitter = require('events');

const Provider = {
	LoginTicket: require('./Ticket/LoginTicket'),
	TicketGrantingTicket: require('./Ticket/TicketGrantingTicket'),
	ServiceTicket: require('./Ticket/ServiceTicket'),
	ProxyGrantingTicket: require('./Ticket/ProxyGrantingTicket'),
	ProxyTicket: require('./Ticket/ProxyTicket')
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

		if (ticketGrantingTicket === null || this.isExpired(ticketGrantingTicket)) {
			throw new Error('Ticket granting ticket is invalid');
		}

		const ticket = this.Ticket.ServiceTicket({ ticketGrantingTicketId, service, principal });

		await this.store.ServiceTicket.create(ticket);

		return ticket;
	}
	
	async createTicketGrantingTicket(principal) {
		const ticket = this.Ticket.TicketGrantingTicket();

		await this.store.TicketGrantingTicket.create(ticket, principal);

		return ticket;
	}
	
	async createProxyTicket(proxyGrantingTicketId, targetService) {
		const ticket = this.Ticket.ProxyTicket(proxyGrantingTicketId, targetService);

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

		if (ticket === null) {
			throw new Error('TGT is NOT existed.');
		}

		return ticket;
	}

	async getProxyGrantingTicket(id) {
		const ticket = this.store.TicketGrantingTicket.select(id);

		if (ticket === null) {
			throw new Error('TGT is NOT existed.');
		}

		return ticket;
	}

	async validateServiceTicket() {

	}

	async validateLoginTicket() {

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