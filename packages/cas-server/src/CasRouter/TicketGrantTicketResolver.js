module.exports = function TicketGrantTicketResolver({
	ticketRegistry,
	ticketGrantCookieName,
	Principal
}) {
	return async function resolveTicketGrantTicket(ctx, next) {
		const ticketGrantCookie = ctx.cookies.get(ticketGrantCookieName);
		const ticketGrantTicket = await ticketRegistry.getTicketGrantTicketById(ticketGrantCookie);
		
		if (ticketGrantTicket) {
			ctx.state.ticketGrantTicket = ticketGrantTicket;
			ctx.state.principal = await Principal.get(ticketGrantTicket.id);
		} else {
			ctx.state.ticketGrantTicket = null;
			ctx.state.principal = null;
		}

		return next();
	};
};