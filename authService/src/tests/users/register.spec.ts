import { DataSource } from "typeorm";
import app from "../../app";

import request from "supertest";
import { AppDataSource } from "../../data-source";
import truncateAllTables from "../utils/testUtils";

describe("POST /auth/register", () => {
  //get connection from the data source
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
    console.log("Connection created successfully", connection.isInitialized);
  });

  beforeEach(() => {
    //clean up the database database truncate
    truncateAllTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
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
      //Act
      //@ts-expect-error: TypeScript does not recognize the app object type
      await request(app).post("/auth/register").send(userData);
      //Assert

      const user = await connection.getRepository("User").find();

      expect(user).toHaveLength(1);
    });
  });

  describe("missing fields", () => {});
});
