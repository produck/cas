const CasError = require('./IssuerErrors');

module.exports = function CredentialAcceptor({ Ticket, Principal, authenticate }) {
	return async function credentialAcceptor(ctx) {
		//TODO
		// const { warn, method } = ctx.query;
		const loginTicketId = ctx.request.body.execution;
		const isValidLoginTicket = await Ticket.validateLoginTicket(loginTicketId);

		if (!isValidLoginTicket) {
			throw CasError.BadLoginTicket();
		}

		const principalAttributes = await authenticate({
			parsed: ctx.request.body,
			raw: ctx.request.rawBody
		});

		if (principalAttributes === null) {
			throw CasError.AuthenticationFailure();
		}
		
		const { ticketGrantingTicket } = ctx.state;
		const basicPrincipal = await Principal.create(ticketGrantingTicket.id, principalAttributes);

		if (ticketGrantingTicket !== null) {
			Ticket.destroyTicketGrantingTicket(ticketGrantingTicket.id);
		}

		ctx.state.principal = basicPrincipal;
		ctx.state.ticketGrantingTicket = await Ticket.createTicketGrantingTicket(basicPrincipal);
		ctx.state.primary = true;
	};
};