module.exports = function CasGatewayApplicationProvider() {
	return function CasGatewayApplication() {
		return function requestListener(request, response) {
			const location = `https://${request.header.host}${request.path}`;

			response.setHeader(302, { 'Location': location });
			response.end();
		};
	};
};
