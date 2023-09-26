const mongoose = require("mongoose");
const AutoIncrement = require('@alec016/mongoose-autoincrement');

AutoIncrement.initialize(mongoose.connection)

module.exports = AutoIncrement;