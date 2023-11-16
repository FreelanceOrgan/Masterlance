const compression = require('express-compression')
const express = require("express");
require("dotenv").config({path: "config.env"});
const cors = require("cors");
const dbConnection = require("./Config/database")
const logger = require("./logger");
const globalErrorHandler = require("./ErrorHandler/globalErrorHandler")
const routesMounting = require("./routesMounting");
const APIError = require("./ErrorHandler/APIError");
const {upsertMainItemsIntoDB} = require('./Config/upsertMainItemsIntoDB');

const app = express();
const port = process.env.Port || 8000;
let server = app.listen();

dbConnection().then(() => {
	server = app.listen(port, async () => {
		console.log(`App is running at: http://localhost:${port}`);
	})
})

app.options('*', cors());
app.use(cors({
	origin: "*",
}))
app.use(compression());
app.use(express.json());
app.use(logger());

routesMounting(app, process.env.apiVersion);

// upsertMainItemsIntoDB();

app.all('*', (request, response, next) => {
	next(new APIError(`This route is not found: ${request.originalUrl}`, 400))
});

app.use(globalErrorHandler);

process.on("unhandledRejection", (error) => {
	console.error(`Unhandled Rejection Errors: ${error}`);
	server.close(() => {
		console.error(`Shutting down....`);
		process.exit(1);
	})
})

