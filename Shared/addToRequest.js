exports.addLoginUserIdToRequestBody = (fieldName) => (request, response, next) => {
	request.body[fieldName] = request.user.id;
	next();
}

exports.addLoginUserIdToRequestQuery = (queryField) => (request, response, next) => {
	if(request.user.role.name === 'freelancer') {
		request.query[queryField] = request.user.id;
	}
	next();
}