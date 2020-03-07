const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const Template = {
	Success: fs.readFileSync(path.join(__dirname, 'SuccessTemplate.ejs'), 'utf-8'),
	Failure: fs.readFileSync(path.join(__dirname, 'FailureTemplate.ejs'), 'utf-8'),
};

const Renderer = {
	Success: ejs.compile(Template.Success),
	Failure: ejs.compile(Template.Failure)
};

const errors = {
	INVALID_REQUEST: 'not all of the required request parameters were present',
	UNAUTHORIZED_SERVICE: 'service is unauthorized to perform the proxy request',
	INTERNAL_ERROR: 'an internal error occurred during ticket validation'
};

module.exports = function ProxyTicketIssuer({ Ticket, Service }) {
	return async function issueProxyTicket(ctx) {
		try {
			const { pgt, targetService } = ctx.query;

			if (!pgt || !targetService) {
				throw 'INVALID_REQUEST';
			}

			const proxyGrantingTicket = await Ticket.getProxyGrantingTicket(pgt);
	
			if (proxyGrantingTicket === null) {
				throw 'INTERNAL_ERROR';
			}
	
			const isServiceValid = await Service.test(targetService);
	
			if (!isServiceValid) {
				throw 'UNAUTHORIZED_SERVICE';
			}
	
			const proxyTicket = await Ticket.createProxyTicket(proxyGrantingTicket.id, targetService);
	
			return ctx.body = Renderer.Success(proxyTicket);
		} catch (errorCode) {
			
			if (typeof errorCode === 'string') {
				return ctx.body = Renderer.Failure({
					code: errorCode,
					description: errors[errorCode]
				});
			}
			
			const error = errorCode;

			return ctx.body = Renderer.Failure({
				code: 'INTERNAL_ERROR',
				description: error.message
			});
		}
	};
};