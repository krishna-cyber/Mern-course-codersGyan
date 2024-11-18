import { Repository } from "typeorm";
import { UserData } from "../types/types";
import { User } from "../entity/User";
import createHttpError from "http-errors";

class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: UserData) {
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
      });
    } catch (error) {
      const err = createHttpError(500, "User registration failed");
      throw err;
    }
  }
}

export default UserService;
