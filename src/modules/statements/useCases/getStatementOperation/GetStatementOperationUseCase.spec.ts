import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "./../../../users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { OperationType } from "@modules/statements/entities/Statement";
import { GetStatementOperationError } from "./GetStatementOperationError";

describe("Get Statement Operation", () => {
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;
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
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able get statement operation", async () => {
    const newUser = await createUserUseCase.execute({
      name: "User test",
      email: "user_test@email.com.br",
      password: "123456",
    });

    const newStatement = await createStatementUseCase.execute({
      user_id: newUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: "Deposit",
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: newUser.id as string,
      statement_id: newStatement.id as string,
    });

    expect(operation).toHaveProperty("id");
  });

  it("should not be able get statement operation nonexistent user", () => {
    expect(async () => {
      const newUser = await createUserUseCase.execute({
        name: "User test",
        email: "user_test@email.com.br",
        password: "123456",
      });

      const newStatement = await createStatementUseCase.execute({
        user_id: newUser.id as string,
        type: OperationType.DEPOSIT,
        amount: 250,
        description: "Deposit",
      });
      await getStatementOperationUseCase
        .execute({
          user_id: "user_id",
          statement_id: newStatement.id as string,
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(GetStatementOperationError.UserNotFound);
        });
    });
  });

  it("should not be able get statement operation nonexistent user", () => {
    expect(async () => {
      const newUser = await createUserUseCase.execute({
        name: "User test",
        email: "user_test@email.com.br",
        password: "123456",
      });

      const newStatement = await createStatementUseCase.execute({
        user_id: newUser.id as string,
        type: OperationType.DEPOSIT,
        amount: 250,
        description: "Deposit",
      });
      await getStatementOperationUseCase
        .execute({
          user_id: newUser.id as string,
          statement_id: "statement_id",
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(
            GetStatementOperationError.StatementNotFound
          );
        });
    });
  });
});
