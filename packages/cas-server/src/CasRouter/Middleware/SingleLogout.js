module.exports = function SingleLogout({ Response, Ticket, tgcName }) {
	const logoutResponse = Response.Logout();

	return async function logout(ctx) {
		const { service } = ctx.query;
		const { ticketGrantingTicket } = ctx.state;
		
		ctx.cookies.set(tgcName, null);
		Ticket.destroyTicketGrantingTicket(ticketGrantingTicket.id);
		
		if (service !== undefined) {
			return ctx.redirect(service);
		}
		
		return logoutResponse(ctx);
	};
};