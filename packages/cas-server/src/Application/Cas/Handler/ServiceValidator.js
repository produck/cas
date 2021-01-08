module.exports = function ServiceValidator({ CAS }) {
	return async function validateService(ctx, next) {
		const { service } = ctx.state;
		const valid = await CAS.Service.match(service);

		if (valid) {
			ctx.state.service = service;

			return next();
		}

		return ctx.throw(403, 'Invalid service');
	};
};