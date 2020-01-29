const ERROR_MAP = {
	// rename errors
	INVALID_REQUESET: 'Not all of the required request parameters were present.',
	INVALID_TICKET_SPEC:  'Failure to meet the requirements of validation sepecification.',
	UNAUTHORIZED_SERVICE_PROXY: 'The service in not authorized to perform proxy authentication.',
	INVALID_PROXY_CALLBACK:'The proxy callback specified is invalid.',
	INVALID_TICKET: 'The ticket provided was not valid.',
	INVALID_SERVICE: 'The ticket provided was valid, but the service specified did not match the service associated with the ticket. ',
	INTERNAL_ERROR: 'An internal error occurred during ticket validation.',
	BAD_PGT: 'The Proxy Granting Ticket invalid.'
};

const FORMAT_REG = /^(JSON|XML)$/;

const ServiceResponse = {
	JSON: {
		Success: {
			Cas20(state) {
				return {
					serviceResponse: {
						authenticationSuccess: {
							user: state.principal.user,
							proxyGrantingTicket: state.proxyGrantingTicket
						}
					}
				};
			},
			Cas30(state) {
				const responseBody = ServiceResponse.JSON.Success.Cas20(state);
				
				Object.assign(responseBody.serviceResponse.authenticationSuccess, {
					attributes: state.principal.attributes,
					proxies: state.principal.proxies
				});
	
				return responseBody;
			},
		},
		Failure(state) {
			return {
				serviceResponse: {
					authenticationFailure: {
						code: state.error.code,
						description: state.error.description
					}
				}
			};
		}
	},
	XML: {
		Success: {
			Cas20() {

			},
			Cas30() {

			}
		},
		Failure(errorCode) {

		}
	}
};

module.exports = function ValidationTransformer() {
	return async function transformValidation(ctx) {
		const { format, cas, error } = ctx.state;

		
	};
};