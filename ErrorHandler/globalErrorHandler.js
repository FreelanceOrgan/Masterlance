const sendErrorForDev = (error, response) => response.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack
    })

const sendErrorForProd = (error, response) => response.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    })


const globalErrorHandler = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if(process.env.NODE_ENV === "development") {
        sendErrorForDev(error, response);
    }
    else {
        sendErrorForProd(error, response);
    }
}

module.exports = globalErrorHandler;