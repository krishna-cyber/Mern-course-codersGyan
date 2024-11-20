import { config } from "dotenv";
import path from "path";

const envPath = path.join(__dirname, `../../.env.${process.env.NODE_ENV}`);

config({ path: envPath });
const { PORT, NODE_ENV, MONGO_URI_ATLAS, DB_NAME } = process.env;

const Config = {
  PORT,
  NODE_ENV,
  MONGO_URI_ATLAS,
  DB_NAME,
};

// Object.freeze(Config);

export { Config, envPath };
