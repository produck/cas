const CasError = require('./IssuerErrors');

module.exports = function CredentialAcceptor({ Ticket, Principal }) {
	return async function credentialAcceptor(ctx) {
		//TODO
		// const { warn, method } = ctx.query;
		const loginTicketId = ctx.request.body.execution;
		const isValidLoginTicket = await Ticket.validateLoginTicket(loginTicketId);

		if (!isValidLoginTicket) {
			throw CasError.BadLoginTicket();
		}

		const principal = await Principal.authenticate({
			parsed: ctx.request.body,
			raw: ctx.request.rawBody
		});

		if (principal === null) {
			throw CasError.AuthenticationFailure();
		}

		const { ticketGrantingTicket } = ctx.state;

		if (ticketGrantingTicket !== null) {
			Ticket.destroyTicketGrantingTicket(ticketGrantingTicket.id);
		}

		ctx.state.principal = principal;
		ctx.state.ticketGrantingTicket = await Ticket.createTicketGrantingTicket();
		ctx.state.primary = true;
	};
};