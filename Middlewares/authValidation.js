const {check} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");
const roleModel = require("../Models/roleModel");

exports.signupValidation = [
	check("fullName")
		.notEmpty().withMessage("Fullname is required")
		.isString().withMessage("Fullname must be string")
		.isLength({min: 3}).withMessage("Too short Fullname, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long Fullname, 32 characters at most"),

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
		.custom((value) => {
			const role = roleModel.findById(value, {_id: 1});
			if(role) {
				return true;
			}
			throw new Error(`This role doesn't exist`);
		}),

	errorExpressValidatorHandler
]

exports.loginValidation = [
	check("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

    check("password")
		.notEmpty().withMessage("Password is required"),

	errorExpressValidatorHandler
]

exports.forgetPasswordValidation = [
	check("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

	errorExpressValidatorHandler
]

exports.verifyResetPasswordCodeValidation = [
	check("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

	check("code")
		.notEmpty().withMessage("Reset Code is required")
		.isInt().withMessage("Reset Code must be an integer number")
		.custom(value => {
			if(value.toString().length !== 6) {
				throw new Error("Invalid code")
			}
			return true
		}),

	errorExpressValidatorHandler
]

exports.resetPasswordValidation = [
	check("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

	check("newPassword")
		.notEmpty().withMessage("New Password is required")
		.matches(/^(?=.*[!@#$%^&*()])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/).withMessage("Password must contain upper, lower characters, numbers and special characters"),

	errorExpressValidatorHandler
]