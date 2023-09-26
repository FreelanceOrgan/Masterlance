const mongoose = require("mongoose");

const dbConnection = async () => {
    const connection = await mongoose.connect(process.env.DatabaseURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`Database is connected: ${connection.connection.host}`)
    // mongoose.set('debug', (collectionName, method, query, doc) => {
    //     console.log(`Query for ${collectionName}.${method}: ${JSON.stringify(query)}`);
    // });
}

module.exports = dbConnection;
