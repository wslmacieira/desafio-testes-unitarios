import { hash } from "bcryptjs";
import { Connection } from "typeorm";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at)
      values('${id}', 'admin', 'admin@finapi.com.br', '${password}', 'now()')
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able authenticate", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "admin",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able authenticate with incorrect password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "incorrect-password",
    });

    expect(response.status).toBe(401);
  });

  it("should not be able authenticate with incorrect email", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "incorrect-email@finapi.com.br",
      password: "admin",
    });

    expect(response.status).toBe(401);
  });
});
