import app from "../../app";

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
dotenv.config({
  path: ".env.test.local",
});

describe("POST /auth/login", () => {
  //get connection from the data source
  //before all test cases this function will rul
  beforeAll(async () => {
    await connectToDatabase();
    mongoose.modelNames().map(async (model) => {
      await mongoose.models[model].deleteMany({});
    });
    // await User.deleteMany({}); //clean up the database
    // await RefreshToken.deleteMany({}); //clean up the database
  });

  afterEach(async () => {
    //clean up the database database truncate
    await User.deleteMany({});
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  describe("given all fields", () => {
    it("should return 200 statusCode correct email,password Given ", async () => {
      //AAA Pattern (Arrange, Act, Assert)
      //register user
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "123456",
      };

      //@ts-ignore
      await request(app).post("/auth/register").send(userData);

      // Act
      //@ts-ignore
      const response = await request(app)
        .post("/auth/login")
        .send({ email: userData.email, password: userData.password });

      // Assert

      expect(response.statusCode).toBe(200);
    });

    it("should return 400 statusCode for incorrect  email or password Given ", async () => {
      //AAA Pattern (Arrange, Act, Assert)
      //register user
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "123456",
      };

      //@ts-ignore
      await request(app).post("/auth/register").send(userData);

      // Act
      //@ts-ignore
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "wrong", password: userData.password });

      // Assert

      expect(response.statusCode).toBe(400);
    });

    it("should return INVALID CREDENTIAL message with 400 statusCode for incorrect  email or password Given ", async () => {
      //AAA Pattern (Arrange, Act, Assert)
      //register user
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "123456",
      };

      //@ts-ignore
      await request(app).post("/auth/register").send(userData);

      // Act
      //@ts-ignore
      const response = await request(app)
        .post("/auth/login")
        .send({ email: userData.email, password: "wrongPassword" });

      // Assert

      expect(response.statusCode).toBe(400);

      expect(response.body.errors.message).toBe("Invalid email or password");
    });

    describe("missing fields", () => {
      // it("should return 400 status code if email field is missing , user should not be registered", async () => {
      //   //Arrange
      //   const userData = {
      //     firstName: "Krishna",
      //     lastName: "Tiwari",
      //     password: "13456",
      //   };
      //   //Act
      //   //@ts-ignore
      //   const response = await request(app).post("/auth/register").send(userData);
      //   const user = await User.find({}); //Assert
      //   expect(response.statusCode).toBe(400);
      //   expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
      // });
      // it("should return 400 status code if firstName field is missing , user should not be registered", async () => {
      //   //Arrange
      //   const userData = {
      //     lastName: "Tiwari",
      //     email: "tiwarikrishna54321@gmail.com",
      //     password: "13456",
      //   };
      //   //Act
      //   //@ts-ignore
      //   const response = await request(app).post("/auth/register").send(userData);
      //   const user = await User.find({}); //Assert
      //   expect(response.statusCode).toBe(400);
      //   expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
      // });
      // it("should return 400 status code if lastName field is missing , user should not be registered", async () => {
      //   //Arrange
      //   const userData = {
      //     firstName: "Krishna",
      //     email: "tiwarikrishna54321@gmail.com",
      //     password: "13456",
      //   };
      //   //Act
      //   //@ts-ignore
      //   const response = await request(app).post("/auth/register").send(userData);
      //   const user = await User.find({}); //Assert
      //   expect(response.statusCode).toBe(400);
      //   expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
      // });
      // it("should return 400 status code if password field is missing , user should not be registered", async () => {
      //   //Arrange
      //   const userData = {
      //     firstName: "Krishna",
      //     lastName: "Tiwari",
      //     email: "tiwarikrishna54321@gmail.com",
      //   };
      //   //Act
      //   //@ts-ignore
      //   const response = await request(app).post("/auth/register").send(userData);
      //   const user = await User.find({}); //Assert
      //   expect(response.statusCode).toBe(400);
      //   expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
      // });
    });

    describe("if fields are not properly formatted", () => {});
  });
});
