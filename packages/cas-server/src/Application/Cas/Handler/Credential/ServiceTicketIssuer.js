module.exports = function ServiceTicketIssuer({ CAS, options }) {
	return async function issueServiceTicket(ctx, next) {
		await next();

		const { tgt, service, principal, primary } = ctx.state;

		if (tgt === null) {
			return ctx.state.responseType = CAS.Response.Type.CredentialRequired;
		}

		const serviceTicket = await CAS.Ticket.createServiceTicket(tgt.id);
		
		principal.extend({ primary });
		// extendAttributes(principal, ctx.state);
		ctx.cookies.set(options.tgcName, serviceTicket.id);

		if (service !== null) {
			return ctx.state.responseType = CAS.Response.Type.AuthenticationSuccess;
		}

		ctx.redirect(IssueToURL(service, serviceTicket.id));
	};
};

function IssueToURL(service, serviceTicketId) {
	const url = new URL(service);

	url.searchParams.append('ticket', serviceTicketId);

	return url.toString();
}