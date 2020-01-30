const Randexp = require('randexp');
const http = require('http');
const generator = new Randexp(/[a-z0-9A-Z]{24}/);

module.exports = function ProxyTicketValidator(ticketRegistry) {
	return async function validateProxyTicket(ctx, next) {
		const { pgtUrl } = ctx.query;

		if (pgtUrl) {
			const { ticketGrantingTicket } = ctx.state;
			const proxyGrantingTicket = await ticketRegistry.createProxyGrantingTicket(ticketGrantingTicket.id);
			const pgtIou = `PGTIOU-${generator.gen()}`;
			const callbackUrl = new URL(pgtUrl);

			callbackUrl.searchParams.set('pgtId', proxyGrantingTicket.id);
			callbackUrl.searchParams.set('pgtIou', pgtIou);

			await new Promise((resolve, reject) => {
				http.get(callbackUrl, res => {
					if (res.statusCode === 200) {
						return resolve();
					}

					return reject(new Error('Can NOT connect to cas client.'));
				});
			});

			ctx.state.proxyGrantingTicket = pgtIou;
		}

		return next();
	};
};