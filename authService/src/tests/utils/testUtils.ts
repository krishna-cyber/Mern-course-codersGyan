import mongoose from "mongoose";

async function truncateDatabase() {
  return await mongoose.connection.db?.dropDatabase();
}

async function closeDatabaseConnection() {
  return await mongoose.connection.close();
}

export { truncateDatabase, closeDatabaseConnection };
