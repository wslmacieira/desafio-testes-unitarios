import { GetBalanceError } from "./GetBalanceError";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { OperationType } from "@modules/statements/entities/Statement";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

describe("Get Balance", () => {
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let getBalanceUseCase: GetBalanceUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able get balance", async () => {
    const newUser = await createUserUseCase.execute({
      name: "User test",
      email: "user_test@email.com.br",
      password: "123456",
    });

    const newStatement = await createStatementUseCase.execute({
      user_id: newUser.id!,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: "Freelas",
    });

    const result = await getBalanceUseCase.execute({ user_id: newUser.id! });

    expect(result).toHaveProperty("balance");
  });

  it("should not be able get balance a nonexists user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "user_id" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
