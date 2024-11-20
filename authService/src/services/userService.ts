import { UserData } from "../types/types";
import { UserDocument } from "../entity/User";
import createHttpError from "http-errors";
import { ROLES } from "../constants/constants";
import { Model, Models } from "mongoose";

class UserService {
  constructor(private User: Model<UserDocument>) {}

  async create({ firstName, lastName, email, password }: UserData) {
    try {
      const user = new this.User({
        firstName,
        lastName,
        email,
        password,
        role: ROLES.CUSTOMER,
      });
      return await user.save();
    } catch (error) {
      const err = createHttpError(500, "User registration failed");
      throw err;
    }
  }
}

export default UserService;
