const deleteUnWantedQueryFields = (request) => {
	const filteredFields = JSON.parse(JSON.stringify(request.query).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`));

	delete filteredFields.select;
	delete filteredFields.sort;
	delete filteredFields.page;
	delete filteredFields.limit;
	delete filteredFields.skip;

	return filteredFields;
};

exports.filter = (request, ...searchFields) => {
	const filteredFields = deleteUnWantedQueryFields(request);

	if(request.query.search) {
		filteredFields.$or = [];
		for(const field of searchFields) {
			filteredFields.$or.push({[field]: {$regex: request.query.search, $options: 'i'}});
		}
	}
	delete filteredFields.search;

	return filteredFields;
};

exports.select = (request) =>  request.query.select ? request.query.select.split(',') : '-__v';

exports.sort = (request) => request.query.sort ? request.query.sort.split(',').join(" ") : "-createdAt";

exports.pagination = async (request, documentCount) => {
	const {page = 1, limit = 6} = request.query;
	return {
		page: +page,
		limit: +limit,
		skip: (+page - 1) * +limit,
		totalPages: Math.ceil(documentCount / +limit)
	}
};