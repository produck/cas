module.exports = function ServiceTicketIssuer({ CAS, options }) {
	const Response = {
		[CAS.Response.Type.WithoutLoginTicket]: ctx => ctx.redirect('/'),
		[CAS.Response.Type.GatewayWithoutTicket]: ctx => ctx.redirect(ctx.state.service),
		[CAS.Response.Type.BadLoginTicket]: options.preset.Response.BadLoginTicket,
		[CAS.Response.Type.CredentialRequired]: options.preset.Response.CredentialRequired,
		[CAS.Response.Type.AuthenticationSuccess]: options.preset.Response.AuthenticationSuccess,
		[CAS.Response.Type.AuthenticationFailure]: options.preset.Response.AuthenticationFailure
	};
	
	return async function issueServiceTicket(ctx, next) {
		Object.assign(ctx.state, {
			tgt: null,
			lt: null,
			service: null,
			principal: null,
			primary: false,
			responseType: null
		});
		
		await next();

		if (ctx.state.responseType !== null) {
			return await Response[ctx.state.responseType](ctx);
		}
	};
};