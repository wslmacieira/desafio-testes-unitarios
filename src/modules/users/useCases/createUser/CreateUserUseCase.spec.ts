import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


describe("Create User", () => {
  let createUserUseCase: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able create a new user', async () => {
    const newUser = await createUserUseCase.execute({
      name: "User test",
      email: "user_test@email.com.br",
      password: "123456"
    });

    expect(newUser).toHaveProperty("id");
  });

  it('should not be able create a new user with exists email', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User test",
        email: "user_test@email.com.br",
        password: "123456"
      });
      await createUserUseCase.execute({
        name: "User test",
        email: "user_test@email.com.br",
        password: "123456"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
