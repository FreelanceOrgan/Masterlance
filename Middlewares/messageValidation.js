const {body} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");

exports.sendMessageValidation = [
	body("fullName")
		.notEmpty().withMessage("Fullname is required")
		.isString().withMessage("Fullname must be string")
		.isLength({min: 3}).withMessage("Too short Fullname, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long Fullname, 32 characters at most"),

	body("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

	body("message")
		.notEmpty().withMessage("Message is required")
		.isString().withMessage("Message must be a string"),

    errorExpressValidatorHandler
]

exports.replyOnMessageValidation = [
	body("subject")
		.notEmpty().withMessage("Subject is required")
		.isString().withMessage("Subject must be a string"),

	body("reply")
		.notEmpty().withMessage("Reply Message is required")
		.isString().withMessage("Reply must be a string"),

    errorExpressValidatorHandler
]