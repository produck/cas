module.exports = function CredentialAcceptor(ticketRegistry, authenticate) {
	return async function credentialAcceptor(ctx, next) {
		//TODO
		// const { warn, method } = ctx.query;
		const { ticketGrantTicket, principal } = ctx.state;
		const loginTicketId = ctx.request.body.execution;
		const isValidLoginTicket = await ticketRegistry.validateLoginTicket(loginTicketId);

		if (!isValidLoginTicket) {
			return ctx.redirect('/');
		}

		if (ticketGrantTicket === null) {
			const principal = await authenticate({
				parsed: ctx.request.body,
				raw: ctx.request.rawBody
			});
	
			if (principal === null) {
				return ctx.throw(401);
			}
	
			const ticketGrantTicket = await ticketRegistry.createTicketGrantTicket();
	
			ctx.state.principal = principal;
			ctx.state.ticketGrantTicket = ticketGrantTicket;
		} else {
			ctx.state.primaryAuth
		}

		return next();
	};
};