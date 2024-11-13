import { config } from "dotenv";
import path from "path";
config({ path: path.join(__dirname, `../../env.${process.env.NODE_ENV}`) });

const {
  PORT,
  NODE_ENV,
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

const Config = {
  PORT,
  NODE_ENV,
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
};

Object.freeze(Config);

export { Config };
