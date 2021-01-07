const CasError = require('./IssuerErrors');

module.exports = function ServiceTicketIssuer({ Ticket, tgcName, Response, extendAttributes }) {
	const responseMap = {
		GatewayWithoutTicket: ctx => ctx.redirect(ctx.state.service),
		BadLoginTicket: Response.BadLoginTicket,
		CredentialRequired: Response.CredentialHolder,
		AuthenticationSuccess: Response.AuthenticationSuccess,
		AuthenticationFailure: Response.AuthenticationFailure
	};
	
	return async function issueServiceTicket(ctx, next) {
		try {
			await next();

			const { ticketGrantingTicket, service, principal, primary } = ctx.state;

			if (ticketGrantingTicket !== null) {
				if (service !== null) {
					const serviceTicket = await Ticket.createServiceTicket(ticketGrantingTicket.id);
					
					principal.extend({ primary });
					extendAttributes(principal, ctx.state);
					
					ctx.cookies.set(tgcName, serviceTicket.id);
					ctx.redirect(IssueToURL(service, serviceTicket.id));
				}

				throw CasError.AuthenticationSuccess();
			}

			throw CasError.CredentialRequired();
		} catch (error) {
			const { casType } = error;
			
			if (!casType) {
				throw error;
			}

			return responseMap[casType](ctx);
		}
	};
};

function IssueToURL(service, serviceTicketId) {
	const url = new URL(service);

	url.searchParams.set('ticket', serviceTicketId);

	return url.toString();
}