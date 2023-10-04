const authRoute = require("./Routes/authRoute");
const roleRoute = require("./Routes/roleRoute");
const userRoute = require("./Routes/userRoute");
const transactionRoute = require("./Routes/transactionRoute");
const webhookRoute = require("./Routes/webhookRoute");

const mountRoutes = (app, apiVersion) => {
    app.use(`${apiVersion}/auth`, authRoute);
    app.use(`${apiVersion}/roles`, roleRoute);
    app.use(`${apiVersion}/users`, userRoute);
    app.use(`${apiVersion}/transactions`, transactionRoute);
    app.use(`${apiVersion}/webhooks`, webhookRoute);
}

module.exports = mountRoutes;