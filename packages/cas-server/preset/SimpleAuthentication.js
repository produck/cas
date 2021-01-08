module.exports = function SimpleAuthentication(userList = []) {
	const store = {};

	userList.forEach(user => store[user.username]);
	
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
