import app from "../../app";

import request from "supertest";
import { closeDatabaseConnection, connectToDatabase } from "../utils/testUtils";
import { ROLES } from "../../constants/constants";
import { User } from "../../entity/User";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { access } from "fs";
dotenv.config({
  path: ".env.test.local",
});

describe("POST /auth/register", () => {
  //get connection from the data source
  //before all test cases this function will rul
  beforeAll(async () => {
    await connectToDatabase();
    await User.deleteMany({}); //clean up the database
  });

  afterEach(async () => {
    //clean up the database database truncate
    await User.deleteMany({});
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  describe("given all fields", () => {
    it("should return 201 statusCode ", async () => {
      //AAA Pattern (Arrange, Act, Assert)

      // Arrange
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "password",
      };

      // Act
      //@ts-expect-error: TypeScript does not recognize the app object type
      const response = await request(app).post("/auth/register").send(userData);

      // Assert

      expect(response.statusCode).toBe(201);
    });

    it("should return valid JSON response", async () => {
      // Arrange
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "123456",
      };

      // Act

      //@ts-expect-error: TypeScript does not recognize the app object type
      const response = await request(app).post("/auth/register").send(userData);
      // Assert

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    it("should persist user in the database", async () => {
      //Arrange
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "123456",
      };

      //@ts-expect-error: TypeScript does not recognize the app object type
      await request(app).post("/auth/register").send(userData);
      //Assert
      const user = await User.find();
      console.log(user);

      expect(user).toHaveLength(1);
    });

    it("should return id of the user", async () => {
      //Arrange
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "13456",
      };

      //Act and Assert
      //@ts-expect-error: TypeScript does not recognize the app object type
      const user = await request(app).post("/auth/register").send(userData);

      // Assert  // user must have id
      expect(user.body).toHaveProperty("result._id");
    });

    it("should assign a customer role to the user", async () => {
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "13456",
      };

      //@ts-expect-error: TypeScript does not recognize the app object type
      await request(app).post("/auth/register").send(userData);
      const user = await User.find();
      expect(user[0].role).toBe(ROLES.CUSTOMER);
    });

    it("should return hashed password ", async () => {
      //Arrange
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "13456",
      };

      //Act
      //@ts-expect-error: TypeScript does not recognize the app object type
      const response = await request(app).post("/auth/register").send(userData);
      const user: { body: { result: { password: string } } } = response;

      expect(user.body.result.password).not.toBe(userData.password);
    });

    it("should return 400 status code if user already exists", async () => {
      //Arrange
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "13456",
      };

      //@ts-expect-error: TypeScript does not recognize the app object type
      await request(app).post("/auth/register").send(userData);
      //Act
      //@ts-expect-error: TypeScript does not recognize the app object type
      const response = await request(app).post("/auth/register").send(userData);

      const user = await User.find({ email: userData.email });
      //Assert
      expect(response.statusCode).toBe(400);
      expect(user).toHaveLength(1); //confirmation only one user exist in the database
    });
    it("should return access token and refresh token inside a cookie", async () => {
      //Arrange
      let accessToken = null;
      let refreshToken = null;

      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "13456",
      };

      interface headers {
        ["set-cookie"]: string[];
      }
      //@ts-expect-error: TypeScript does not recognize the app object type
      const response = await request(app).post("/auth/register").send(userData);

      //Act
      const cookies =
        (response.headers as unknown as headers)["set-cookie"] || [];

      cookies.forEach((cookie: string) => {
        //get access token send by server as cookie
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }

        //get refresh Token sent by server as cookie
        if (cookie.startsWith("refreshToken=")) {
          refreshToken = cookie.split(";")[0].split("=")[1];
        }
      });

      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();
    });
  });

  describe("missing fields", () => {
    it("should return 400 status code if email field is missing , user should not be registered", async () => {
      //Arrange
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        password: "13456",
      };

      //Act
      //@ts-expect-error: TypeScript does not recognize the app object type
      const response = await request(app).post("/auth/register").send(userData);

      const user = await User.find({}); //Assert
      expect(response.statusCode).toBe(400);
      expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
    });

    it("should return 400 status code if firstName field is missing , user should not be registered", async () => {
      //Arrange
      const userData = {
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "13456",
      };

      //Act
      //@ts-expect-error: TypeScript does not recognize the app object type
      const response = await request(app).post("/auth/register").send(userData);

      const user = await User.find({}); //Assert
      expect(response.statusCode).toBe(400);
      expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
    });

    it("should return 400 status code if lastName field is missing , user should not be registered", async () => {
      //Arrange
      const userData = {
        firstName: "Krishna",
        email: "tiwarikrishna54321@gmail.com",
        password: "13456",
      };

      //Act
      //@ts-expect-error: TypeScript does not recognize the app object type
      const response = await request(app).post("/auth/register").send(userData);

      const user = await User.find({}); //Assert
      expect(response.statusCode).toBe(400);
      expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
    });

    it("should return 400 status code if password field is missing , user should not be registered", async () => {
      //Arrange
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
      };

      //Act
      //@ts-expect-error: TypeScript does not recognize the app object type
      const response = await request(app).post("/auth/register").send(userData);

      const user = await User.find({}); //Assert
      expect(response.statusCode).toBe(400);
      expect(user).toHaveLength(0); //confimation user doesn't exist in the database if validation fails
    });
  });

  describe("if fields are not properly formatted", () => {});
});
