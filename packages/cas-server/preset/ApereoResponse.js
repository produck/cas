module.exports = function ApereoResponse() {
	return {
		BadLoginTicket(ctx) {
			ctx.body = 'BadLoginTicket';
		},
		CredentialRequired(ctx) {
			ctx.body = 'CredentialRequired';
		},
		AuthenticationSuccess(ctx) {
			ctx.body = 'AuthenticationSuccess';
		},
		AuthenticationFailure(ctx) {
			ctx.body = 'AuthenticationFailure';
		}
	};
};
