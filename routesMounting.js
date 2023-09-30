const authRoute = require("./Routes/authRoute");
const roleRoute = require("./Routes/roleRoute");
const userRoute = require("./Routes/userRoute");
const transactionRoute = require("./Routes/transactionRoute");

const mountRoutes = (app, apiVersion) => {
    app.use(`${apiVersion}/auth`, authRoute);
    app.use(`${apiVersion}/roles`, roleRoute);
    app.use(`${apiVersion}/users`, userRoute);
    app.use(`${apiVersion}/transactions`, transactionRoute);
}

module.exports = mountRoutes;