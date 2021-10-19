import { hash } from "bcryptjs";
import { Connection } from "typeorm";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Get Balance Controller", () => {
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

  it("should be able get balance", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "admin",
    });

    const { token } = responseToken.body;

    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 250,
        description: "Deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const withdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 150,
        description: "Withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.statement[0].id).toBe(deposit.body.id);
    expect(response.body.statement[1].id).toBe(withdraw.body.id);
  });
});
