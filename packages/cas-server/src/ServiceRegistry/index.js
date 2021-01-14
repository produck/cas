
function normalize(_options = {}) {
	const options = {
		//name,
		//Registry,
		Service: {}
	};

	return options;
}

module.exports = function ServiceRegistryProvider(options) {
	const finalOptions = normalize(options);
	const { Service, Registry } = finalOptions;
	const ServiceClass = {};

	Service.forEach(serviceClassOptions => {
		const {
			name,
			ObjectSchema,
			ConstructorOptionsSchema,
			constructor
		} = serviceClassOptions;

		const Validator = {
			object: nValidator(ObjectSchema),
			constructorOptions: nValidator(ConstructorOptionsSchema),
		};

		class Service {
			constructor(options) {
				constructor(this, options);
			}

			get className() {
				return name;
			}

			static get className() {
				return name;
			}

			static async create(options) {
				const valid = Validator.constructorOptions(options);

				if (!valid) {
					throw new TypeError('Invalid service constructor options.');
				}


			}
		}

		ServiceClass[name] = Service;
	});

	class ServiceRegistry {
		constructor(store) {
			this.store = store;
		}

		get name() {
			return finalOptions.name;
		}

		async match(queryOptions) {

		}
	}

	return ServiceRegistry;
};
