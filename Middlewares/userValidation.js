const {check} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");
const roleModel = require("../Models/roleModel");

exports.addUserValidation = [
	check("firstName")
		.notEmpty().withMessage("Firstname is required")
		.isString().withMessage("Firstname must be string")
		.isLength({min: 3}).withMessage("Too short firstname, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long firstname, 32 characters at most")
		.matches(/^[a-zA-Z]+$/g).withMessage("Firstname must contain only characters"),

	check("lastName")
		.notEmpty().withMessage("Lastname is required")
		.isString().withMessage("Lastname must be string")
		.isLength({min: 3}).withMessage("Too short lastname, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long lastname, 32 characters at most")
		.matches(/^[a-zA-Z]+$/g).withMessage("Lastname must contain only characters"),

	check("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

    check("password")
		.notEmpty().withMessage("Password is required")
		.matches(/^(?=.*[!@#$%^&*()])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/).withMessage("Password must contain upper, lower characters, numbers and special characters"),
    
	check("profileImage")
		.optional()
		.isURL().withMessage("Invalid Photo"),

	check("mobilePhone")
		.optional()
		.isMobilePhone("any").withMessage("Invalid Mobile Phone"),
		
	check("role")
		.notEmpty().withMessage("Any user must have a role")
		.isInt().withMessage("Invalid Role")
		.custom(async (value) => {
			const role = await roleModel.findById(value, {_id: 1});
			if(role) {
				return true;
			}
			throw new Error(`This role doesn't exist`);
		}),

    errorExpressValidatorHandler
]

exports.updateUserValidation = [
	check("firstName")
		.optional()
		.isString().withMessage("Firstname must be string")
		.isLength({min: 3}).withMessage("Too short firstname, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long firstname, 32 characters at most")
		.matches(/^[a-zA-Z]+$/g).withMessage("Firstname must contain only characters"),

	check("lastName")
		.optional()
		.isString().withMessage("Lastname must be string")
		.isLength({min: 3}).withMessage("Too short lastname, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long lastname, 32 characters at most")
		.matches(/^[a-zA-Z]+$/g).withMessage("Lastname must contain only characters"),

	check("profileImage")
		.optional()
		.isURL().withMessage("Invalid Photo"),

	check("mobilePhone")
		.optional()
		.isMobilePhone("any").withMessage("Invalid Mobile Phone"),
		
	check("role")
		.optional()
		.isInt().withMessage("Invalid Role")
		.custom(async (value) => {
			const role = await roleModel.findById(value, {_id: 1});
			if(role) {
				return true;
			}
			throw new Error(`This role doesn't exist`);
		}),

	check("available")
        .optional()
        .isBoolean().withMessage("Available must be boolean"),

	check("blocked")
        .optional()
        .isBoolean().withMessage("Blocked must be boolean"),

    check("deleted")
        .optional()
        .isBoolean().withMessage("Deleted must be boolean"),
		
    errorExpressValidatorHandler
]

exports.changeEmailValidation = [
	check("currentEmail")
		.notEmpty().withMessage("Current Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),
	
	check("newEmail")
		.notEmpty().withMessage("New Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

    check("password")
		.notEmpty().withMessage("Password is required"),

    errorExpressValidatorHandler
]

exports.changePasswordValidation = [
	check("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

    check("currentPassword")
		.notEmpty().withMessage("Current Password is required"),

	check("newPassword")
		.notEmpty().withMessage("New Password is required")
		.matches(/^(?=.*[!@#$%^&*()])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/).withMessage("Password must contain upper, lower characters, numbers and special characters"),

    errorExpressValidatorHandler
]