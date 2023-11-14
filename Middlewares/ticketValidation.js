const {body} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");

exports.sendTicketValidation = [
	body("title")
		.notEmpty().withMessage("Title is required")
		.isString().withMessage("Title must be string"),

	body("description")
		.notEmpty().withMessage("Description is required")
		.isString().withMessage("Description must be string")
		.custom((value, {req}) => {
			req.body.isReplied = false;
			return true
		}),

    errorExpressValidatorHandler
]

exports.replyOnTicketValidation = [
	body("subject")
		.notEmpty().withMessage("Subject is required")
		.isString().withMessage("Subject must be a string"),

	body("reply")
		.notEmpty().withMessage("Reply Message is required")
		.isString().withMessage("Reply must be a string"),

    errorExpressValidatorHandler
]