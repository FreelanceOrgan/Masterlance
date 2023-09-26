const APIError = require("./APIError");

const notFoundRoutes = () => (request, response, next) => {
    next(new APIError(`This route is not found: ${request.originalUrl}`, 400))
}

module.exports = notFoundRoutes;

