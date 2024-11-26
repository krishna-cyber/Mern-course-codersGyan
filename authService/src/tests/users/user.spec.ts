import app from "../../app";
import jwksra from "mock-jwks";

import request from "supertest";
import {
  closeDatabaseConnection,
  connectToDatabase,
  isJWT,
} from "../utils/testUtils";
import { ROLES } from "../../constants/constants";
import { User } from "../../entity/User";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { access } from "fs";
import { RefreshToken } from "../../entity/RefreshToken";
import createJWKSMock from "mock-jwks";
dotenv.config({
  path: ".env.test.local",
});

let JwkMock: ReturnType<typeof createJWKSMock>;

describe("GET /auth/self", () => {
  //get connection from the data source
  //before all test cases this function will rul
  beforeAll(async () => {
    JwkMock = createJWKSMock("https://localhost:5501");

    await connectToDatabase();
    mongoose.modelNames().map(async (model) => {
      await mongoose.models[model].deleteMany({});
    });
    // await User.deleteMany({}); //clean up the database
    // await RefreshToken.deleteMany({}); //clean up the database
  });

  beforeEach(() => {
    JwkMock.start();
  });

  afterEach(async () => {
    //clean up the database database truncate
    await User.deleteMany({});
    JwkMock.stop();
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  describe("given all fields", () => {
    it("should return 200 status code", async () => {
      //@ts-ignore
      const response = await request(app).get("/auth/self").send();

      expect(response.status).toBe(200);
    });

    it("should return user data", async () => {
      //register a user
      const userData = {
        email: "tiwarikrishna54321@gmail.com",
        password: "password",
        firstName: "Krishna",
        lastName: "Tiware",
      };
      //@ts-ignore
      const response = await request(app).post("/auth/register").send(userData);

      const accessToken = JwkMock.token({
        sub: String(response.body.result._id),
        role: response.body.role,
      });

      //@ts-ignore
      const userSelf = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`]);

      //assert
      expect(userSelf.body._id).toBe(response.body.result._id);
    });
  });
});
