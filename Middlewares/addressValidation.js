const {check} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");

exports.addAddressValidation = [
	check("alias")
		.notEmpty().withMessage("Any address must have an alias name")
		.trim()
		.isString().withMessage("Alias name must be string")
		.isLength({min: 3}).withMessage("Too alias name, 3 characters at least")
		.isLength({max: 20}).withMessage("Too alias name, 32 characters at most"),

	check("country")
		.notEmpty().withMessage("Any address must have a country name")
		.trim()
		.isString().withMessage("Country name must be string")
		.isLength({min: 3}).withMessage("Too short country name, 3 characters at least")
		.isLength({max: 20}).withMessage("Too long country name, 20 characters at most"),

	check("city")
		.notEmpty().withMessage("Any address must have a city name")
		.trim()
		.isString().withMessage("City name must be string")
		.isLength({min: 3}).withMessage("Too short city name, 3 characters at least")
		.isLength({max: 20}).withMessage("Too long city name, 20 characters at most"),

	check("postalCode")
		.notEmpty().withMessage("Any address must have a postal code")
		.isPostalCode("any").withMessage("Invalid postal code"),

	check("details")
		.notEmpty().withMessage("Any address must have details")
		.trim()
		.isString().withMessage("City name must be string")
		.isLength({min: 20}).withMessage("Too short details, 20 characters at least")
		.isLength({max: 200}).withMessage("Too long details, 200 characters at most"),

	errorExpressValidatorHandler
]

exports.updateAddressValidation = [
	check("alias")
		.notEmpty().withMessage("Any address must have an alias name")
		.trim()
		.isString().withMessage("Alias name must be string")
		.isLength({min: 3}).withMessage("Too alias name, 3 characters at least")
		.isLength({max: 20}).withMessage("Too alias name, 32 characters at most"),

	check("country")
		.notEmpty().withMessage("Any address must have a country name")
		.trim()
		.isString().withMessage("Country name must be string")
		.isLength({min: 3}).withMessage("Too short country name, 3 characters at least")
		.isLength({max: 20}).withMessage("Too long country name, 20 characters at most"),

	check("city")
		.notEmpty().withMessage("Any address must have a city name")
		.trim()
		.isString().withMessage("City name must be string")
		.isLength({min: 3}).withMessage("Too short city name, 3 characters at least")
		.isLength({max: 20}).withMessage("Too long city name, 20 characters at most"),

	check("postalCode")
		.notEmpty().withMessage("Any address must have a postal code")
		.isPostalCode("any").withMessage("Invalid postal code"),

	check("details")
		.notEmpty().withMessage("Any address must have details")
		.trim()
		.isString().withMessage("City name must be string")
		.isLength({min: 20}).withMessage("Too short details, 20 characters at least")
		.isLength({max: 200}).withMessage("Too long details, 200 characters at most"),

	errorExpressValidatorHandler
]