module.exports = function TicketGrantTicketResolver(registry, options) {
	return async function ticketGrantTicketResolver(ctx, next) {
		const ticketGrantCookie = ctx.cookies.get(options.ticketGrantCookieName);
		const ticketGrantTicket = await registry.ticket.getTicketGrantTicketById(ticketGrantCookie);

		ctx.state.ticketGrantTicket = ticketGrantTicket ? ticketGrantTicket : null;

		return next();
	};
};