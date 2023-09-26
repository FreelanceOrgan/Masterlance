const {check} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");

exports.idValidation = [
	check('id')
		.isInt().withMessage('Invalid id format, must be integer'),
	errorExpressValidatorHandler
]