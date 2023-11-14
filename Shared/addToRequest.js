
const addParentIdFromParamToRequestBody = (parent, id) => (request, response, next) => {
    if(!request.body[parent]) {
        request.body[parent] = +request.params[id]
    }
    next();
}

const addParentIdFromParamToRequestQuery = (parent, id) => (request, response, next) => {
    if(request.params[id]) {
        request.query[parent] = +request.params[id]
    }
    next();
}

const addLoginUserIdToRequestBody = (fieldName) => (request, response, next) => {
    request.body[fieldName] = request.user.id;
    next();
}

const addLoginUserIdToRequestQuery = (queryField) => (request, response, next) => {
    if(request.user.role.name === 'freelancer') {
        request.query[queryField] = request.user.id;
    }
    next();
}

module.exports = {addParentIdFromParamToRequestQuery, addParentIdFromParamToRequestBody, addLoginUserIdToRequestBody, addLoginUserIdToRequestQuery}