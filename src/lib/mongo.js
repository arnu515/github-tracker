import { MongoClient } from "mongodb";

const mongo = new MongoClient(process.env.MONGODB_URL);

// Export the connection promise
export default mongo.connect();
