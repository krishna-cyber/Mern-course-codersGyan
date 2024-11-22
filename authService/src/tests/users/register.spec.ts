import app from "../../app";

import request from "supertest";
import { closeDatabaseConnection, connectToDatabase } from "../utils/testUtils";
import { ROLES } from "../../constants/constants";
import { User } from "../../entity/User";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
  path: ".env.test.local",
});

describe("POST /auth/register", () => {
  //get connection from the data source
  //before all test cases this function will rul
  beforeAll(async () => {
    await connectToDatabase();
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
      //Assert
      expect(response.statusCode).toBe(400);
    });
  });

  describe("missing fields", () => {});
});
