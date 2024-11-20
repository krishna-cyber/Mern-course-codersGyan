import "reflect-metadata";

import { Config } from "./config/config";
import logger from "./config/logger";

import mongoose from "mongoose";

mongoose
  .connect(Config.MONGO_URI_ATLAS!, {
    autoCreate: true,
  })
  .then(() => {
    logger.info("MongoDB connection established successfully");
  })
  .catch((error) => {
    logger.error("MongoDB connection failed", error);
  });
