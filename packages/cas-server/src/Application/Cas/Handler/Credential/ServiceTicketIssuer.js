module.exports = function ServiceTicketIssuer({
	CAS, options,
	// extendAttributes
}) {
	const Response = {
		[CAS.Response.Type.GatewayWithoutTicket]: ctx => ctx.redirect(ctx.state.service),
		[CAS.Response.Type.BadLoginTicket]: options.response.BadLoginTicket,
		[CAS.Response.Type.CredentialRequired]: options.response.CredentialRequired,
		[CAS.Response.Type.AuthenticationSuccess]: options.response.AuthenticationSuccess,
		[CAS.Response.Type.AuthenticationFailure]: options.response.AuthenticationFailure
	};
	
	return async function issueServiceTicket(ctx, next) {
		await next();

		const { ticketGrantingTicket, service, principal, primary } = ctx.state;

		if (ticketGrantingTicket !== null) {
			if (service !== null) {
				const serviceTicket = await CAS.Ticket.createServiceTicket(ticketGrantingTicket.id);
				
				principal.extend({ primary });
				// extendAttributes(principal, ctx.state);
				
				ctx.cookies.set(options.tgcName, serviceTicket.id);
				ctx.redirect(IssueToURL(service, serviceTicket.id));
			} else {
				ctx.state.responseType = CAS.Response.Type.AuthenticationSuccess;
			}
		} else {
			ctx.state.responseType = CAS.Response.Type.CredentialRequired;
		}

		return await Response[ctx.state.responseType](ctx);
	};
};

function IssueToURL(service, serviceTicketId) {
	const url = new URL(service);

	url.searchParams.set('ticket', serviceTicketId);

	return url.toString();
}