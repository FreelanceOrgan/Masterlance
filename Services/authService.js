const asyncHandler = require("express-async-handler");
const APIError = require("../ErrorHandler/APIError");
const userModel = require("../Models/userModel")
const {ModelNames} = require('../enums/ModelPermissions');
const {verifyAccessToken} = require('./JWTGenerator');

const authentication = asyncHandler(async (request, response, next) => { 
    if(request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
        const token = request.headers.authorization.split(" ")[1];
        const decodedPayload = verifyAccessToken(token);
        const user = await userModel.findById(decodedPayload.id, {role: 1, passwordUpdatedTime: 1});
        if(user && user.role.name === decodedPayload.role.name) {
            if(user.passwordUpdatedTime) {
                const passwordUpdatedTimeInSeconds = parseInt(user.passwordUpdatedTime.getTime() / 1000, 10);
                if(passwordUpdatedTimeInSeconds > decodedPayload.iat) {
                    throw new APIError("Unauthorized, try to login again", 401);
                }
            }
            request.user = decodedPayload;
            next();
            return;
        }
    }
    throw new APIError("Unauthorized, try to login again", 401);
});

const authorization = (modelName) =>
asyncHandler(async (request, response, next) => { 
    let permission = request.method.toLowerCase();
    for(const allowedModel of request.user.role.allowedModels) {
        if(allowedModel.modelName.toLowerCase() === modelName.toLowerCase() && allowedModel.permissions.includes(permission)) {
            next();
            return;
        }
    }

    if(permission === "post"){
        permission = "add"
    }
    if(permission === "patch"){
        permission = "update"
    }
    throw new APIError(`Not Allowed to ${permission} ${modelName}`, 403);
});

const preventFreelancerRole = asyncHandler(async (request, response, next) => { 
    if(request.user.role.name.toLowerCase() === "freelancer") {
        throw new APIError('Not allow to access this route', 403);
    }
    next();
});

const allowFreelancerRoleOnly = asyncHandler(async (request, response, next) => { 
    if(request.user.role.name.toLowerCase() !== "freelancer") {
        throw new APIError('The Freelancers only can add new item on this route', 403);
    }
    next();
});

const checkParamIdEqualTokenId = (userId = 'id') => asyncHandler(async (request, response, next) => { 
    if(request.user.role.name.toLowerCase() === "freelancer" &&+request.params[userId] !== request.user.id) {
        throw new APIError('Not allow to access this route, the Id in route not match the Id in the token', 403);
    }
    next();
});

module.exports = {authentication, authorization, preventFreelancerRole, allowFreelancerRoleOnly, checkParamIdEqualTokenId};
