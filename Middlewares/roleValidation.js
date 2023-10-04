const {body} = require("express-validator");
const slugify = require("slugify")
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");
const roleModel = require("../Models/roleModel");

const validModels = [ 'roles', 'users'];
const validPermissions = ['get', 'post', 'patch', 'put', 'delete'];

exports.addRoleValidation = [
	body("name")
		.notEmpty().withMessage("Role name is required")
		.isString().withMessage("Role Name must be string")
		.isLength({min: 3}).withMessage("Too short role name, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long role name, 32 characters at most")
        .custom(async value => {
            const role = await roleModel.findOne({slug: slugify(value)}, {_id: 1});
            if(role) {
                throw new Error('This role name already exists')
            }
            return true
        }),

    body("allowedModels")
        .isArray({min: 1}).withMessage("Any role must have one controlled model at least")
        .customSanitizer((allowedModels) => [...new Map(allowedModels.map(obj => [JSON.stringify(obj).toLowerCase(), obj])).values()])
        .custom(allowedModels => {
            for(const model of allowedModels) {
                if(!model.modelName || !validModels.includes(model.modelName.toLowerCase())) {
                    throw new Error(`Invalid model: ${model.modelName}`);
                }
                if(!model.permissions || model.permissions.length === 0) {
                    throw new Error('Any model must has one permission at least');
                }
                for(const permission of model.permissions) {
                    if(!validPermissions.includes(permission.toLowerCase())) {
                        throw new Error(`Invalid permission: ${permission}`);
                    }
                }
            }
            return true
        }),

    errorExpressValidatorHandler
]

exports.updateRoleValidation = [
	body("name")
		.optional()
		.isString().withMessage("Role name must be string")
		.isLength({min: 3}).withMessage("Too short role name, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long role name, 32 characters at most")
        .custom(async (value, {req}) => {
            const role = await roleModel.findOne({slug: slugify(value)}, {_id: 1});
            if(role && +req.params.id !== role._id) {
                throw new Error('This role name already exists')
            }
            return true
        }),

    body("allowedModels")
        .optional()
        .isArray({min: 1}).withMessage("Any role must have one controlled model at least")
        .customSanitizer((allowedModels) => [...new Map(allowedModels.map(obj => [JSON.stringify(obj).toLowerCase(), obj])).values()])
        .custom(allowedModels => {
            for(const model of allowedModels) {
                if(!model.modelName || !validModels.includes(model.modelName.toLowerCase())) {
                    throw new Error(`Invalid model: ${model.modelName}`);
                }
                if(!model.permissions || model.permissions.length === 0) {
                    throw new Error('Any model must has one permission at least');
                }
                for(const permission of model.permissions) {
                    if(!validPermissions.includes(permission.toLowerCase())) {
                        throw new Error(`Invalid permission: ${permission}`);
                    }
                }
            }
            return true
        }),

    body("available")
        .optional()
        .isBoolean().withMessage("Available must be boolean")
        .custom(async (value, {req}) => {
            if(value) {
                const role = await roleModel.findById(req.params.id);
                if(role.slug === "client") {
                    throw new Error("You can not block client role because all the system depends on this role")
                }
            }
            return true;
        }),
    
    body("deleted")
        .optional()
        .isBoolean().withMessage("Deleted must be boolean")
        .custom(async (value, {req}) => {
            if(value) {
                const role = await roleModel.findById(req.params.id);
                if(role.slug === "client" || role.slug === "super-admin") {
                    throw new Error(`You can not delete ${role.name} role because all the system depends on this role`)
                }
            }
            return true;
        }),
		
	errorExpressValidatorHandler,
]

exports.deleteRoleValidation = [
    body("id")
        .custom(async (value, {req}) => {
            const role = await roleModel.findById(req.params.id);
            if(role.slug === "client" || role.slug === "super-admin") {
                throw new Error(`You can not delete ${role.name} role because all the system depends on this role`)
            }
            return true;
        }),
		
	errorExpressValidatorHandler,
]