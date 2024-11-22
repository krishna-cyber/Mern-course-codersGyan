import mongoose from "mongoose";

async function closeDatabaseConnection() {
  return await mongoose.connection.close();
}

async function connectToDatabase() {
  return await mongoose.connect(process.env.MONGO_URI_ATLAS as string);
}

export { connectToDatabase, closeDatabaseConnection };
