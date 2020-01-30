async (ctx, next) => {
	const { service } = ctx.query;
	const { ticketGrantCookie } = ctx.state;
	
	await ticketRegistry.removeTicketGrantingTicket(ticketGrantCookie);
	ctx.cookies.set(options.ticketGrantCookieName, null);
	
	if (service !== undefined) {
		return ctx.redirect(service);
	}

	ctx.state.data = {
		type: 'logout.noservice'
	};

	return next();
}