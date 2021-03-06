
module.exports = function ServiceTicketValidator({ CAS }) {
	return async function serviceTicketValidator(ctx, next) {
		const { ticket: serviceTicketId } = ctx.query;
		const { principal, renew, service } = ctx.state;
	
		if (renew === undefined) {
			return ctx.throw(400, 'The query value of `renew` is INVALID.');
		}
	
		await CAS.Ticket.validateServiceTicket(serviceTicketId);
	
		ctx.state.principal = principal;
		ctx.state.serviceTicket = serviceTicketId;
		ctx.state.renew = renew;
		ctx.state.service = service;
		
		return next();
	};
};

