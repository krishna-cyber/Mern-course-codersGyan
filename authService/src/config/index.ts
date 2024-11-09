import { config } from "dotenv";
config();

const { PORT } = process.env;

const Config = {
  PORT,
};

Object.freeze(Config);

export { Config };
