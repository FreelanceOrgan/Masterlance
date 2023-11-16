const fs = require("fs")
const morgan = require("morgan");

const logger = () => {
	if(process.env.NODE_ENV === "development")
	{
		return morgan("tiny", {
			stream: fs.createWriteStream("./access.log", {
				flags: "a",
			}),
		})
			
	}
	return morgan("dev");
}

module.exports = logger;