function normalize(_options = {}) {
	const options = {
		userList: [
			{ username: 'produck', password: 'produck' }
		]
	};

	const {
		userList: _userList = options.userList
	} = _options;

	options.userList = _userList;

	return options;
}

module.exports = function SimpleAuthentication(options) {
	const finalOptions = normalize(options);
	const store = {};

	finalOptions.userList.forEach(user => store[user.username] = user);
	
	return function authenticate(credential) {
		const { username, password } = credential;
		const user = store[username];
		
		if (!user || user.password !== password) {
			return null;
		}

		return {
			username,
			attributes: {}
		};
	};
};
