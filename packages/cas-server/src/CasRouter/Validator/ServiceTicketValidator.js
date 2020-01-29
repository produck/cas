
module.exports = function ServiceTicketValidator() {
	async function serviceTicketValidator(ctx, next) {
		const {
			ticket: serviceTicketId,
			pgtUrl,
			service,
			renew: renewStringValue
		} = ctx.query;
	
		const renew = { true: true,  false: false }[renewStringValue];
	
		if (renew === undefined) {
			return ctx.throw(400, 'The query value of `renew` is INVALID.');
		}
	
		const serviceTicket = await ticketRegistry.getServiceTicketById(serviceTicketId);
		const principal = await ticketRegistry.getTicketGrantTicketById(serviceTicket.ticketGrantTicketId);
	
		ctx.state.principal = principal;
		ctx.state.serviceTicket = serviceTicketId;
		ctx.state.renew = renew;
		ctx.state.service = service;
		ctx.state.cas = 1;
	
		return next();
	}
};

