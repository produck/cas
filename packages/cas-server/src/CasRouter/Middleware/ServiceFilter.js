module.exports = function ServiceFiler(serviceRegistry) {
	return async function serviceFilter(ctx, next) {
		const { service } = ctx.query;
		const valid = await serviceRegistry.service.test(service);

		if (valid) {
			ctx.state.service = service;

			return next();
		}
		
		return ctx.throw(403, 'Invalid service');
	};
};