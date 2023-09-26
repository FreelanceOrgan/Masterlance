const roleRoute = require("./Routes/roleRoute");
const userRoute = require("./Routes/userRoute");
const authRoute = require("./Routes/authRoute");


const mountRoutes = (app, apiVersion) => {
    app.use(`${apiVersion}/auth`, authRoute);
    app.use(`${apiVersion}/user`, userRoute);
    app.use(`${apiVersion}/role`, roleRoute);
}

module.exports = mountRoutes;