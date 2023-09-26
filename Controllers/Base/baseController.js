const asyncHandler = require('express-async-handler');
const APIError = require("../../ErrorHandler/APIError");
const responseFormatter = require("../../ResponseFormatter/responseFormatter");
const updatedFields = require("../../Shared/updatedFields");
const {filter, select, sort, pagination} = require("../../Shared/queryRequest");

exports.getAllDocuments = (model, modelName = 'Items', ...searchFields) => 
    asyncHandler(async (request, response) => {
        const filtedFields = filter(request, ...searchFields);
        const {page, limit, skip, totalPages} = await pagination(request, await model.countDocuments(filtedFields));
        const AllDocuments = await model.find(filtedFields, select(request)).skip(skip).limit(limit).sort(sort(request));
        if(AllDocuments.length > 0) {
            response.status(200).json(responseFormatter(true, `All ${modelName} are retrieved successfully`, AllDocuments, page, limit, totalPages));
        }
        else {
            response.status(200).json(responseFormatter(true, `Empty, No ${modelName} to show`, AllDocuments, page, limit, totalPages));
        }
})

exports.getDocumentById = (model, modelName = 'Item') => 
    asyncHandler(async (request, response, next) => {
        const document = await model.findById(request.params.id, select(request))
        if(!document) {
            next(new APIError(`This ${modelName} is not found`, 404));
            return;
        }
        response.status(200).json(responseFormatter(true, `The data of this ${modelName} is retrieved successfully`, [document]));
})

exports.addDocument = (model, modelName = 'Item') => 
    asyncHandler(async (request, response) => {
        const document = await model.create(request.body);
        response.status(201).json(responseFormatter(true, `The ${modelName} is added successfully`, [document]));
})

exports.updateDocument = (model, modelName = 'Item', ...feildsThatAllowToUpdate) => 
    asyncHandler(async (request, response, next) => {
        const targetFields = updatedFields(request, feildsThatAllowToUpdate);
        if(Object.keys(targetFields).length > 0) { 
            const updatedDocument = await model.findOneAndUpdate({_id: request.params.id}, targetFields, {new: true})
            if(!updatedDocument) {
                next(new APIError(`This ${modelName} is not found`, 404));
                return;
            }
            await updatedDocument.save();
            response.status(200).json(responseFormatter(true, `This ${modelName} is updated successfully`, [updatedDocument]));
            return;
        }        
        response.status(200).json(responseFormatter(true, `Nothing is updated`));
})

exports.softDeleteDocument = (model, modelName = 'Item') =>
    asyncHandler(async (request, response, next) => {
        const deletedDocument = await model.findOneAndUpdate({_id: request.params.id}, {deleted: true, available: false})
        if(!deletedDocument) {
            next(new APIError(`This ${modelName} is not found`, 404));
            return;
        }
        response.status(204).json();
})

exports.hardDeleteDocument = (model, modelName = 'Item') =>
    asyncHandler(async (request, response, next) => {
        const deletedDocument = await model.findOneAndDelete({_id: request.params.id})
        if(!deletedDocument) {
            next(new APIError(`This ${modelName} is not found`, 404));
            return;
        }
        response.status(204).json();
})