module.exports = {
	Response: {
		Type: {
			WithoutLoginTicket: Symbol('WithoutLoginTicket'),
			GatewayWithoutTicket: Symbol('GatewayWithoutTicket'),
			BadLoginTicket: Symbol('BadLoginTicket'),
			CredentialRequired: Symbol('CredentialRequired'),
			AuthenticationSuccess: Symbol('AuthenticationSuccess'),
			AuthenticationFailure: Symbol('AuthenticationFailure'),
		}
	}
};
