module.exports = function ServiceTicketIssuer(
	ticketRegistry
) {
	return async function issueServiceTicket(ctx) {
		const { ticketGrantTicket, service } = ctx.state;
		const ticket = await ticketRegistry.createServiceTicket(ticketGrantTicket.id);

		ctx.redirect(resolveIssueURL(service, ticket));
	};
};

function resolveIssueURL(service, ticket) {
	const url = new URL(service);

	url.searchParams.set('ticket', ticket);

	return url.toString();
}