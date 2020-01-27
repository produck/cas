function PrincipalCasV1(user) {
	return user;
};

function PrincipalCasV2(user) {
	return {
		user: user
	};
};

function PrincipalCasV3(user, attribute) {
	return {
		user: user,
		attribute: attribute
	};
};

module.exports = {
	v1: PrincipalCasV1,
	v2: PrincipalCasV2,
	v3: PrincipalCasV3
};