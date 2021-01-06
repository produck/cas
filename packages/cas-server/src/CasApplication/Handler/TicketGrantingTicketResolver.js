module.exports = function TicketGrantingTicketResolver({ Ticket, tgcName, Principal }) {
	return async function resolveTicketGrantingTicket(ctx, next) {
		const ticketGrantingTicketId = ctx.cookies.get(tgcName);
		const ticketGrantingTicket = await Ticket.getTicketGrantingTicketById(ticketGrantingTicketId);
		
		ctx.state.ticketGrantingTicket = null;
		ctx.state.principal = null;

		if (ticketGrantingTicket !== null) {
			ctx.state.ticketGrantingTicket = ticketGrantingTicket;
			ctx.state.principal = await Principal.get(ticketGrantingTicket.id);
		}

		return next();
	};
};