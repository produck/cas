const ANY_SERVICE = {
	id: 1,
	serviceId: '^https?://.*',
	name: 'Any',
	description: 'Matching all.',
	logoutUrl: undefined,
	logoutType: 'BACK_CHANNEL'
};

function normalize(_options = {}) {
	const options = {
		serviceList: [ANY_SERVICE]
	};

	const {
		serviceList: _serviceList = options.serviceList
	} = _options;

	options.serviceList = _serviceList;

	return options;
}

module.exports = function SimpleJsonServiceRegistry(options) {
	const finalOptions = normalize(options);
	const store = finalOptions.serviceList.map(serviceOptions => {
		return {
			serviceId: new RegExp(serviceOptions.serviceId),
			options: serviceOptions
		};
	});

	return {
		match(serviceId) {
			const matched = store.find(mapper => mapper.serviceId.test(serviceId));

			return matched ? matched.options : null;
		}
	};
};
