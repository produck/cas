module.exports = function CredentialAcceptor(ticketRegistry, Principal, logouter) {
	return async function credentialAcceptor(ctx, next) {
		//TODO
		// const { warn, method } = ctx.query;
		const loginTicketId = ctx.request.body.execution;
		const isValidLoginTicket = await ticketRegistry.validateLoginTicket(loginTicketId);

		if (!isValidLoginTicket) {
			return ctx.redirect('/');
		}

		const principal = await Principal.authenticate({
			parsed: ctx.request.body,
			raw: ctx.request.rawBody
		});

		if (principal === null) {
			return ctx.throw(401);
		}

		const { ticketGrantingTicket } = ctx.state;

		if (ticketGrantingTicket !== null) {
			ticketRegistry.destroyTicketGrantingTicket(ticketGrantingTicket.id);
			logouter.dispatch(ticketGrantingTicket.serviceTicketList);
		}

		ctx.state.principal = principal;
		ctx.state.ticketGrantingTicket = await ticketRegistry.createTicketGrantingTicket();
		ctx.state.primary = true;

		return next();
	};
};