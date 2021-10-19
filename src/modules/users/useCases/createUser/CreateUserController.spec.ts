import { Connection } from "typeorm";
import request from "supertest";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able create new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user_test@email.com.br",
      password: "123456",
    });

    expect(response.status).toBe(201);
  });
});
