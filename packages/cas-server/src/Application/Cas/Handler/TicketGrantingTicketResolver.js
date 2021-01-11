module.exports = function TicketGrantingTicketResolver({ CAS, options }) {
	const { tgcKey } = options.cookie.tgcKey;

	return async function resolveTicketGrantingTicket(ctx, next) {
		const id = ctx.cookies.get(tgcKey);
		
		ctx.state.ticketGrantingTicket = null;
		ctx.state.principal = null;
		
		const ticketGrantingTicket = await CAS.Ticket.getTicketGrantingTicket(id);
		
		if (ticketGrantingTicket !== null) {
			ctx.state.ticketGrantingTicket = ticketGrantingTicket;
			ctx.state.principal = await CAS.Principal.get(ticketGrantingTicket.id);
		}

		return next();
	};
};