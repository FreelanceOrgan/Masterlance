const {param} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");

exports.idValidation = [
	param('id')
		.isInt().withMessage('Invalid id format, must be integer'),
	errorExpressValidatorHandler
]