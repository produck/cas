module.exports = function CredentialAcceptor({ CAS, options }) {
	return async function credentialAcceptor(ctx) {
		//TODO
		// const { warn, method } = ctx.query;
		const loginTicketId = options.preset.getLoginTicket(ctx);

		if (loginTicketId === null) {
			return ctx.state.responseType = CAS.Response.Type.WithoutLoginTicket;
		}

		ctx.state.lt = loginTicketId;

		const isValidLoginTicket = await CAS.Ticket.validateLoginTicket(loginTicketId);

		if (!isValidLoginTicket) {
			return ctx.state.responseType = CAS.Response.Type.BadLoginTicket;
		}

		const principalAttributes = await CAS.authenticate({
			parsed: ctx.request.body,
			raw: ctx.request.rawBody
		});

		if (principalAttributes === null) {
			return ctx.state.responseType = CAS.Response.Type.AuthenticationFailure;
		}
		
		const { tgt } = ctx.state;
		const basicPrincipal = await CAS.Principal.create(tgt.id, principalAttributes);

		//TODO re-auth?
		if (tgt !== null) {
			CAS.Ticket.destroyTicketGrantingTicket(tgt.id);
		}

		ctx.state.principal = basicPrincipal;
		ctx.state.tgt = await CAS.Ticket.createTicketGrantingTicket(basicPrincipal);
		ctx.state.primary = true;
	};
};