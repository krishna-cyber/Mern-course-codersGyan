import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Config } from "./config/config";
import logger from "./config/logger";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST,
  port: Number(Config.DB_PORT) || 5432,
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,

  //   Turn synchronize to true to create tables automatically
  // make sure it is false in production
  // synchronize: Config.NODE_ENV === "development" || Config.NODE_ENV === "test",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

//  function to initialize the connection
AppDataSource.initialize()
  .then(() => {
    logger.info("Database connection established successfully");
  })
  .catch((error) => {
    logger.error("Database connection failed", error);
  });
