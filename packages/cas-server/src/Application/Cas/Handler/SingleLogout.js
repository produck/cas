module.exports = function SingleLogout({ CAS, options }) {
	const { tgcKey } = options.cookie;

	return async function logout(ctx) {
		const { service } = ctx.query;
		const { ticketGrantingTicket } = ctx.state;
		
		ctx.cookies.set(tgcKey, null);
		await CAS.Ticket.destroyTicketGrantingTicket(ticketGrantingTicket.id);
		// TODO back channel slo
		
		if (service !== undefined) {
			return ctx.redirect(service);
		}
		
		ctx.body = CAS.Response.Logout();
	};
};