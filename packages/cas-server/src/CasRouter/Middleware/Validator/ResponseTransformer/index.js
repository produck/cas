const ERROR_MAP = require('./errors.json');
const isValidQuery = require('./isValidQuery');
const Format = require('./Format');

const FORMAT_TYPE_MAP = {
	XML: 'text/xml',
	JSON: 'application/json'
};

module.exports = function ValidationTransformer() {
	return async function transformValidation(ctx, next) {
		Object.assign(ctx.state, {
			cas: null,
			proxyGrantingTicket: null,
			proxies: [],
			format,
			error: null
		});
		
		if (isValidQuery(ctx.query)) {
			await next();
		} else {
			ctx.state.error = 'INVALID_REQUESET';
		}

		const {
			format,
			cas: version,
			error: errorCode,
			principal,
			proxies,
			proxyGrantingTicket
		} = ctx.state;

		if (version === 1) {
			ctx.type = 'text/plain';
			ctx.body = errorCode ? 'no\n' : `yes\n${principal.user}\n`;
		} else {
			ctx.type = FORMAT_TYPE_MAP[format];
					
			if (errorCode !== null) {
				ctx.body = Format[format].Failure({
					code: errorCode,
					description: ERROR_MAP[errorCode]
				});
			} else {
				ctx.body = Format[format].Success[`Cas${version}0`]({
					principal,
					proxies,
					proxyGrantingTicket
				});
			}
		}
	};
};