//TODO PGTIOU
module.exports = function ProxyTicketValidator() {
	return async function validateProxyTicket(ctx, next) {

		ctx.state.cas = 2;

		return next();
	};
};