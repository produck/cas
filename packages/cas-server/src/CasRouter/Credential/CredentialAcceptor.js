module.exports = function CredentialAcceptor(registry) {
	return async function credentialAcceptor(ctx, next) {
		const { service, warn, method } = ctx.query;
		const { execution: loginTicketId } = ctx.request.body;
		

	};
};