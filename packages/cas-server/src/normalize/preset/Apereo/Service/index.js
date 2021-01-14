
class ApereoCasServiceRegistry {
	constructor() {

	}

}

class RegexRegisteredService {

}

module.exports = {
	name: 'ApereoCasDefaultService',
	Registry: {
		ConstructorOptions: 
	},
	Service: [
		{
			name: 'RegexRegisteredService',
			ObjectSchema: require('./Schema/RegexRegisteredService/Object.json'),
			ConstructorOptionsSchema: require('./Schema/RegexRegisteredService/ConstructorOptions.json'),
			constructor(service, options) {
				const {
					id,
					name,
					serviceId,
					description,
					informationUrl,
					privacyUrl,
					redirectUrl,
					logo,
					theme,
					evaluationOrder,
					logoutType,
					publicKey,
					logoutUrl,
					proxyPolicy,
					authenticationPolicy,
					attributeReleasePolicy,
					responseType,
					usernameAttributeProvider,
					accessStrategy,
					properties,
					multifactorPolicy,
					contacts,
					matchingStrategy,
				} = options;
				
				Object.assign(service, {
					id, name, serviceId, description,
					informationUrl,
				});
			}
		}
	]
};
