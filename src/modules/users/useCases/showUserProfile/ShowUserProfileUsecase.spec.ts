import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

describe("Show User Profile", () => {
  let showUserProfileUseCase: ShowUserProfileUseCase;
  let createUserUseCase: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able show profile", async () => {
    const newUser = await createUserUseCase.execute({
      name: "User test",
      email: "user_test@email.com.br",
      password: "123456",
    });

    const user = await showUserProfileUseCase.execute(newUser.id as string);

    expect(user).toHaveProperty("id");
  });

  it("should not be able show profile an user not exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User test",
        email: "user_test@email.com.br",
        password: "123456",
      });

      await showUserProfileUseCase.execute("user_id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
