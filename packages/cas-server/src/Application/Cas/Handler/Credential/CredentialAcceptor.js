module.exports = function CredentialAcceptor({ CAS }) {
	return async function credentialAcceptor(ctx) {
		//TODO
		// const { warn, method } = ctx.query;
		const loginTicketId = ctx.request.body.execution;
		const isValidLoginTicket = await CAS.Ticket.validateLoginTicket(loginTicketId);

		if (!isValidLoginTicket) {
			return ctx.state.responseType = CAS.Reponse.Type.BadLoginTicket;
		}

		const principalAttributes = await CAS.authenticate({
			parsed: ctx.request.body,
			raw: ctx.request.rawBody
		});

		if (principalAttributes === null) {
			return ctx.state.responseType = CAS.Reponse.Type.AuthenticationFailure;
		}
		
		const { ticketGrantingTicket } = ctx.state;
		const basicPrincipal = await CAS.Principal.create(ticketGrantingTicket.id, principalAttributes);

		if (ticketGrantingTicket !== null) {
			CAS.Ticket.destroyTicketGrantingTicket(ticketGrantingTicket.id);
		}

		ctx.state.principal = basicPrincipal;
		ctx.state.ticketGrantingTicket = await CAS.Ticket.createTicketGrantingTicket(basicPrincipal);
		ctx.state.primary = true;
	};
};