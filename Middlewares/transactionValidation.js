const {body} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");

const paymentMethods = ['vodafoneCash', 'bankAccountNumber'];

exports.addTransactionValidation = [
    body("amount")
        .notEmpty().withMessage("Any transaction must have an amount")
        .isFloat().withMessage("Any transaction must have a float number")
        .custom(value => {
            if(value < 0) {
                throw new Error("The transaction amount must be more than zero")
            }
            return true
        }),

    body("paymentMethod")
        .notEmpty().withMessage("Any transaction must have a payment method")
        .isString().withMessage("Any pa must have an amount")
        .isIn(paymentMethods).withMessage(`The payment methods that is allowed to be used are ${paymentMethods}`),

    body("paymentMethodRequirements")
        .notEmpty().withMessage("Any transaction must have a payment method requirements")
        .isString().withMessage("paymentMethodRequirements must be a string")
        .custom((value, {req}) => {
            if(req.body.paymentMethod === 'vodafoneCash') {
                if(!/^010\d{8}$/.test(value)) {
                    throw new Error("Invalid Vodafone cash number")
                }
            }
            if(req.body.paymentMethod === 'bankAccountNumber') {
                if(!/^\d{9,18}$/.test(value) && !/^[0-9]+$/.test(value) && !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(value)) {
                    throw new Error("Invalid bank account number");
                }
            }
            return true;
        }),

    errorExpressValidatorHandler
]

exports.updateTransactionValidation = [
    body("amount")
        .optional()
        .isFloat().withMessage("Any transaction must have a float number")
        .custom(value => {
            if(value < 0) {
                throw new Error("The transaction amount must be more than zero")
            }
            return true
        }),

    body("paymentMethod")
        .optional()
        .isString().withMessage("Any pa must have an amount")
        .isIn(paymentMethods).withMessage(`The payment methods that is allowed to be used are ${paymentMethods}`),

    body("paymentMethodRequirements")
        .notEmpty().withMessage("Any transaction must have a payment method requirements")
        .isString().withMessage("paymentMethodRequirements must be a string")
        .custom((value, {req}) => {
            if(req.body.paymentMethod === 'vodafoneCash') {
                if(!/^010\d{8}$/.test(value)) {
                    throw new Error("Invalid Vodafone cash number")
                }
            }
            if(req.body.paymentMethod === 'bankAccountNumber') {
                if(!/^\d{9,18}$/.test(value) && !/^[0-9]+$/.test(value) && !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(value)) {
                    throw new Error("Invalid bank account number");
                }
            }
            return true;
        }),
    
    body("available")
        .optional()
        .isBoolean().withMessage("Available must be boolean"),

    body("deleted")
        .optional()
        .isBoolean().withMessage("Deleted must be boolean"),
		
	errorExpressValidatorHandler,
]

