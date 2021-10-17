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

  it("should be able create a new statement", async () => {
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

    expect(newStatement).toHaveProperty("id");
  });

  it('should not be able create a statement with user not exists', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'user_id',
        type: OperationType.DEPOSIT,
        amount: 250,
        description: "Freelas",
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it('should not be able create a statement with insufficientFunds', async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      email: "user_test@email.com.br",
      password: "123456",
    });
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.WITHDRAW,
        amount: 250,
        description: "Aluguel",
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });
});
