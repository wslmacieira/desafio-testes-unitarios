import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe("Create Statement", () => {
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
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
  });

  it("should be able create a new deposit", async () => {
    const newUser = await createUserUseCase.execute({
      name: "User test",
      email: "user_test@email.com.br",
      password: "123456",
    });

    const deposit = await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: "Deposit",
    });

    expect(deposit).toHaveProperty("id");
  });

  it("should be able create a new withdraw", async () => {
    const newUser = await createUserUseCase.execute({
      name: "User test",
      email: "user_test@email.com.br",
      password: "123456",
    });

    await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: "Deposit",
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: OperationType.WITHDRAW,
      amount: 150,
      description: "Withdraw",
    });

    expect(withdraw).toHaveProperty("id");
  });

  it("should not be able create a new withdraw with insufficient funds", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      email: "user_test@email.com.br",
      password: "123456",
    });
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 250,
        description: "Withdraw",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not be able create a statement with nonexistent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user_id",
        type: OperationType.DEPOSIT,
        amount: 250,
        description: "Deposit",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
