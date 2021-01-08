module.exports = function TicketGrantingTicketResolver({ CAS, options }) {
	const { tgcKey } = options.cookie.tgcKey;

	return async function resolveTicketGrantingTicket(ctx, next) {
		const ticketGrantingTicketId = ctx.cookies.get(tgcKey);
		const ticketGrantingTicket = await CAS.Ticket.getTicketGrantingTicketById(ticketGrantingTicketId);
		
		ctx.state.ticketGrantingTicket = null;
		ctx.state.principal = null;

		if (ticketGrantingTicket !== null) {
			ctx.state.ticketGrantingTicket = ticketGrantingTicket;
			ctx.state.principal = await CAS.Principal.get(ticketGrantingTicket.id);
		}

		return next();
	};
};