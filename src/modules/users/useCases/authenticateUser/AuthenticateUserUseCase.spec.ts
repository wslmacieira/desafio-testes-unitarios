import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

describe("Authenticate User", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able authenticate user", async () => {
    const user = {
      name: "User test",
      email: "user_test@email.com.br",
      password: "123456",
    };
    await createUserUseCase.execute(user);

    const userAuthenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(userAuthenticate).toHaveProperty("token");
  });

  it("should not be able authenticate a nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "naocadastrado@email,com.br",
        password: "password_false",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able authenticate with incorrect password", async () => {
    expect(async () => {
      const user = {
        name: "User test",
        email: "user_test@email.com.br",
        password: "123456",
      };
      await createUserUseCase.execute(user);

      const userAuthenticate = await authenticateUserUseCase.execute({
        email: user.email,
        password: "password_errado",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
