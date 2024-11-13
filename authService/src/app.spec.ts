import app from "./app";
import { calculateDiscount } from "./utils/utils";
import request from "supertest";

describe.skip("App", () => {
  it("should run the test", () => {
    const discoutn = calculateDiscount(100, 10);
    expect(discoutn).toBe(10);
  });

  it("should return 200", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  });
});
