const productModel = require("../Models/productModel");

const addCategoryIdToRequestBody = async (request, response, next) => {
    const product = await productModel.findById({_id: request.params.id}, {_id: 0, category: 1});
    request.body.category = product.category
    next();
}

const addSubCategoriesToRequestBody = async (request, response, next) => {
    const product = await productModel.findById({_id: request.params.id}, {_id: 0, subCategories: 1});
    request.body.subCategories = product.subCategories;
    next();
}

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

module.exports = {addCategoryIdToRequestBody, addSubCategoriesToRequestBody, addParentIdFromParamToRequestQuery, addParentIdFromParamToRequestBody, addLoginUserIdToRequestBody}