import { Config } from "./config";
import app from "./app";

console.log(Config.PORT);

const startServer = () => {
  try {
    app.listen(Config.PORT, () => {
      console.log(`Server is running on http://localhost:${Config.PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
