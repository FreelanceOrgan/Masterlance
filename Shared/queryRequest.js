const filter = (request, ...searchFields) => {
	//Filter by comparing
	const filteredFields = JSON.parse(JSON.stringify(request.query).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`));
	
	//Delete another saved keywords to make filteredFields clear
	delete filteredFields.select;
	delete filteredFields.sort;
	delete filteredFields.page;
	delete filteredFields.limit;
	delete filteredFields.skip;

	//Filter by regex matching
	if(request.query.search) {
		filteredFields.$or = [];
		// eslint-disable-next-line no-restricted-syntax
		for(const field of searchFields) {
			filteredFields.$or.push({[field]: {$regex: request.query.search, $options: 'i'}});
		}
	}

	//Delete search keyword to make filteredFields clear
	delete filteredFields.search;

	//Add a condition to get only available and not deleted documents
	if(!filteredFields.available) {
		filteredFields.available = true;
	}
	if(!filteredFields.deleted) {
		filteredFields.deleted = false;
	}

	return filteredFields;
}

// const select = (request) =>  request.query.select ? `${request.query.select.split(',').join(" ")} -__v` : "-__v";
const select = (request) =>  request.query.select ? request.query.select.split(',') : '-__v';

const sort = (request) => request.query.sort ? request.query.sort.split(',').join(" ") : "-createdAt";

const pagination = async (request, documentCount) => {
    const {page = 1, limit = 3} = request.query;
    return {
        page: +page,
        limit: +limit,
        skip: (+page - 1) * +limit,
        totalPages: Math.ceil(documentCount / +limit)
    }
}

module.exports = {filter, select, sort, pagination};