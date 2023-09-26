const multer = require("multer");
const APIError = require("../ErrorHandler/APIError")


const multerFilter = (request, file, cb) => file.mimetype.startsWith("image") ? cb(null, true) : cb(new APIError("Only Images allowed", 400), false);

const memoryStorage = multer.memoryStorage()

const multerSettings = multer({fileFilter: multerFilter, storage: memoryStorage});

module.exports = {multerSettings};