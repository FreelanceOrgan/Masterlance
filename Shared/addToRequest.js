
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

const addLoginUserIdToRequestBody = (request, response, next) => {
    request.body.user = request.user.id;
    next();
}

module.exports = {addParentIdFromParamToRequestQuery, addParentIdFromParamToRequestBody, addLoginUserIdToRequestBody}