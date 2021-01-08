
class Service {
	constructor(serviceOptions) {
		this.options = serviceOptions;
	}

	get id() {
		return this.options.id;
	}

	get name() {

	}

	get description() {

	}

	get redirectUrl() {

	}

}

module.exports = class ServiceRegistry {
	constructor(options) {
		this.options = options;
	}
	
	async match(serviceId) {
		const matchedService = await this.options.match(serviceId);

		if (matchedService === null) {
			return null;
		}

		return new Service(matchedService);
	}
};