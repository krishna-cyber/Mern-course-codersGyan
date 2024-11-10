import app from "./src/app";
import { calculateDiscount } from "./src/utils/utils";
import request from "supertest";

describe("App", () => {
  it("should run the test", () => {
    const discoutn = calculateDiscount(100, 10);
    expect(discoutn).toBe(10);
  });

  it("should return 200", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  });
});
