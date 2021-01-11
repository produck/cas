module.exports = {
	Response: {
		Type: {
			GatewayWithoutTicket: Symbol('GatewayWithoutTicket'),
			BadLoginTicket: Symbol('BadLoginTicket'),
			CredentialRequired: Symbol('CredentialRequired'),
			AuthenticationSuccess: Symbol('AuthenticationSuccess'),
			AuthenticationFailure: Symbol('AuthenticationFailure'),
		}
	}
};
