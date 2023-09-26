const asyncHandler = require("express-async-handler");
require("dotenv").config({path: "config.env"});
const JWT = require("jsonwebtoken");
const APIError = require("../ErrorHandler/APIError");
const userModel = require("../Models/userModel")

const authontication = asyncHandler(async (request, response, next) => { 
    if(request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
        const token = request.headers.authorization.split(" ")[1];
        const decodedPayload = JWT.verify(token, process.env.Secret_Key);
        const user = await userModel.findById(decodedPayload.id, {role: 1, passwordUpdatedTime: 1});
        if(user && user.role.name === decodedPayload.role.name) {
            if(user.passwordUpdatedTime) {
                const passwordUpdatedTimeInSeconds = parseInt(user.passwordUpdatedTime.getTime() / 1000, 10);
                if(passwordUpdatedTimeInSeconds > decodedPayload.iat) {
                    throw new APIError("Unathorized, try to login again", 401);
                }
            }
            request.user = decodedPayload;
            next();
            return;
        }
    }
    throw new APIError("Unathorized, try to login again", 401);
});

const authorization = (modelName) =>
asyncHandler(async (request, response, next) => { 
    const permission = request.method.toLowerCase();
    // eslint-disable-next-line no-restricted-syntax
    for(const allowedModel of request.user.role.allowedModels) {
        if(allowedModel.modelName.toLowerCase() === modelName.toLowerCase() && allowedModel.permissions.includes(permission)) {
            next();
            return;
        }
    }
    // eslint-disable-next-line no-nested-ternary
    throw new APIError(`Not Allowed to ${permission === "post" ? "add" : permission || permission === "patch" ? "update" : permission} ${modelName}`, 403);
});

const preventClientRole = asyncHandler(async (request, response, next) => { 
    if(request.user.role.name.toLowerCase() === "client") {
        throw new APIError('Not allow to access this route', 403);
    }
    next();
});

const allowClientRoleOnly = asyncHandler(async (request, response, next) => { 
    if(request.user.role.name.toLowerCase() !== "client") {
        throw new APIError('The clients only can add new item on this route', 403);
    }
    next();
});

const checkParamIdEqualTokenId = (userId = 'id') => asyncHandler(async (request, response, next) => { 
    if(request.user.role.name.toLowerCase() === "client" &&+request.params[userId] !== request.user.id) {
        throw new APIError('Not allow to access this route, the Id in route not match the Id in the token', 403);
    }
    next();
});

module.exports = {authontication, authorization, preventClientRole, allowClientRoleOnly, checkParamIdEqualTokenId};
