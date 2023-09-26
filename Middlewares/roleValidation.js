const {check} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");

const validModels = ['categories', 'subcategories', 'brands', 'products', 'roles', 'wishlists', 'coupons', 'orders', 'reviews', 'users'];
const validPermissions = ['get', 'post', 'patch', 'put', 'delete'];

exports.addRoleValidation = [
	check("name")
		.notEmpty().withMessage("Role name is required")
		.isString().withMessage("Role Name must be string")
		.isLength({min: 3}).withMessage("Too short role name, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long role name, 32 characters at most"),

    check("allowedModels")
        .isArray({min: 1}).withMessage("Any role must have one controlled model at least")
        .customSanitizer((allowedModels) => [...new Map(allowedModels.map(obj => [JSON.stringify(obj).toLowerCase(), obj])).values()])
        .custom(allowedModels => {
            // eslint-disable-next-line no-restricted-syntax
            for(const model of allowedModels) {
                if(!model.modelName || !validModels.includes(model.modelName.toLowerCase())) {
                    throw new Error(`Invalid model: ${model.modelName}`);
                }
                if(!model.permissions || model.permissions.length === 0) {
                    throw new Error('Any model must has one permission at least');
                }
                // eslint-disable-next-line no-restricted-syntax
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
	check("name")
		.optional()
		.isString().withMessage("Role name must be string")
		.isLength({min: 3}).withMessage("Too short role name, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long role name, 32 characters at most"),

    check("allowedModels")
        .optional()
        .isArray({min: 1}).withMessage("Any role must have one controlled model at least")
        .customSanitizer((allowedModels) => [...new Map(allowedModels.map(obj => [JSON.stringify(obj).toLowerCase(), obj])).values()])
        .custom(allowedModels => {
            // eslint-disable-next-line no-restricted-syntax
            for(const model of allowedModels) {
                if(!model.modelName || !validModels.includes(model.modelName.toLowerCase())) {
                    throw new Error(`Invalid model: ${model.modelName}`);
                }
                if(!model.permissions || model.permissions.length === 0) {
                    throw new Error('Any model must has one permission at least');
                }
                // eslint-disable-next-line no-restricted-syntax
                for(const permission of model.permissions) {
                    if(!validPermissions.includes(permission.toLowerCase())) {
                        throw new Error(`Invalid permission: ${permission}`);
                    }
                }
            }
            return true
        }),

    check("available")
        .optional()
        .isBoolean().withMessage("Available must be boolean"),

    check("deleted")
        .optional()
        .isBoolean().withMessage("Deleted must be boolean"),
		
	errorExpressValidatorHandler,
]