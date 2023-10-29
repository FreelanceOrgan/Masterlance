const {body} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");

exports.SSOValidation = [
	body("code")
		.notEmpty().withMessage("Code is required"),

	body("redirectUrl")
		.notEmpty().withMessage("RedirectUrl is required"),

	errorExpressValidatorHandler
]