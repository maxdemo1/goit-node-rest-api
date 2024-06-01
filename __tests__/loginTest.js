import supertest from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import "dotenv/config";

describe("loginTest", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_KEY);
  });
  afterAll(async () => {
    mongoose.disconnect(process.env.TEST_DB_KEY);
  });
  test("should return user data", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "typ11e@dss.ss",
      password: "sdssAs1s",
    });
    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(
      typeof response.body.token === "string" && response.body.token.length > 0
    ).toBe(true);
    expect(
      typeof response.body.user.email === "string" &&
        response.body.user.email.length > 0 &&
        response.body.user.subscription.length > 0 &&
        typeof response.body.user.subscription === "string"
    ).toBe(true);
  });
});
