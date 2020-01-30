module.exports = function ServiceTicketIssuer(ticketRegistry) {
	return async function issueServiceTicket(ctx) {
		const { ticketGrantingTicket, service } = ctx.state;
		const ticket = await ticketRegistry.createServiceTicket(ticketGrantingTicket.id);

		ctx.redirect(resolveIssueURL(service, ticket.id));
	};
};

function resolveIssueURL(service, serviceTicketId) {
	const url = new URL(service);

	url.searchParams.set('ticket', serviceTicketId);

	return url.toString();
}