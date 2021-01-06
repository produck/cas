module.exports = function ServiceValidator({ Service }) {
	return async function validateService(ctx, next) {
		const { service } = ctx.state;
		const valid = await Service.test(service);

		if (valid) {
			ctx.state.service = service;

			return next();
		}

		return ctx.throw(403, 'Invalid service');
	};
};