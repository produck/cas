
module.exports = function ServiceTicketValidator(ticketRegistry) {
	return async function serviceTicketValidator(ctx, next) {
		const { ticket: serviceTicketId, pgtUrl, service, renew } = ctx.query;
		const { principal } = ctx.state;
	
		// const renew = { true: true,  false: false }[renewStringValue];
		//TODO check renew
	
		if (renew === undefined) {
			return ctx.throw(400, 'The query value of `renew` is INVALID.');
		}
	
		const serviceTicket = await ticketRegistry.validateServiceTicket(serviceTicketId);
	
		ctx.state.principal = principal;
		ctx.state.serviceTicket = serviceTicketId;
		ctx.state.renew = renew;
		ctx.state.service = service;
		ctx.state.cas = 1;
	
		return next();
	};
};

