exports.updatedFields = function(request, allowedFieldsToUpdate) {
	const targetFields = {};
	for(const prop of allowedFieldsToUpdate) {
		if(request.body[prop] !== undefined) {
			targetFields[prop] = request.body[prop];	
		}
	}
	return targetFields;
};