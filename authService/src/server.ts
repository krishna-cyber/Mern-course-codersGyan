import { Config } from "./config";
import app from "./app";
import logger from "./config/logger";

const startServer = () => {
  try {
    app.listen(Config.PORT, () => {
      logger.info(`Server is running on port ${Config.PORT}`, {
        port: Config.PORT,
      });
      logger.error(`This is an error log!`); // this log is consoled because it is an error log
      logger.debug(`Debugging is enabled!`); // this log is not consoled because we set priority level upto only info in logger transport
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.info(`Error: ${error}`);
    process.exit(1);
  }
};

startServer();
