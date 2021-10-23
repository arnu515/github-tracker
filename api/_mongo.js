const { MongoClient } = require("mongodb");
const mongo = new MongoClient(process.env.MONGODB_URL);

// Export the connection promise
module.exports = mongo.connect();
