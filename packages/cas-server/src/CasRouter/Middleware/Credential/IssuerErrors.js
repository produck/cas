function CasErrorProvider(type, defaultMessage = type) {
	return function Error(message = defaultMessage) {
		const error = new Error(message);

		error.casType = type;

		return error;
	};
}

module.exports = {
	GatewayWithoutTicket: CasErrorProvider('GatewayWithoutTicket'),
	BadLoginTicket: CasErrorProvider('BadLoginTicket'),
	CredentialRequired: CasErrorProvider('CredentialRequired'),
	AuthenticationSuccess: CasErrorProvider('AuthenticationSuccess'),
	AuthenticationFailure: CasErrorProvider('AuthenticationFailure')
};