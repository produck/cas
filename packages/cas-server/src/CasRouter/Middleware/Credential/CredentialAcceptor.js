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

		const { ticketGrantTicket } = ctx.state;

		if (ticketGrantTicket !== null) {
			ticketRegistry.destroyTicketGrantTicket(ticketGrantTicket.id);
			logouter.dispatch(ticketGrantTicket.serviceTicketList);
		}

		ctx.state.principal = principal;
		ctx.state.ticketGrantTicket = await ticketRegistry.createTicketGrantTicket();
		ctx.state.primary = true;

		return next();
	};
};