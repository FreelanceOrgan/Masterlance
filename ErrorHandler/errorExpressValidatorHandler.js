const { validationResult } = require('express-validator');
const APIError = require("./APIError");
const globalErrorHandler = require("./globalErrorHandler")

// @desc  Finds the validation errors in this request and wraps them in an object with handy functions
const errorValidator = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        globalErrorHandler(new APIError(errors.errors[0].msg, 400), request, response, next);        
        return;
    }
    next();
}

module.exports = errorValidator