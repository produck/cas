module.exports = function TicketGrantingTicketResolver({
	ticketRegistry,
	ticketGrantCookieName,
	Principal
}) {
	return async function resolveTicketGrantingTicket(ctx, next) {
		const ticketGrantCookie = ctx.cookies.get(ticketGrantCookieName);
		const ticketGrantingTicket = await ticketRegistry.getTicketGrantingTicketById(ticketGrantCookie);
		
		if (ticketGrantingTicket) {
			ctx.state.ticketGrantingTicket = ticketGrantingTicket;
			ctx.state.principal = await Principal.get(ticketGrantingTicket.id);
		} else {
			ctx.state.ticketGrantingTicket = null;
			ctx.state.principal = null;
		}

		return next();
	};
};