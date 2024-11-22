import { UserData } from "../types/types";
import { UserDocument } from "../entity/User";
import createHttpError from "http-errors";
import { ROLES } from "../constants/constants";
import { Model, Models } from "mongoose";

class UserService {
  constructor(private User: Model<UserDocument>) {}

  async create({ firstName, lastName, email, password }: UserData) {
    const user = new this.User({
      firstName,
      lastName,
      email,
      password,
      role: ROLES.CUSTOMER,
    });
    //check for user already exist or not in the database
    const existingUser = await this.User.findOne({ email });

    if (existingUser) {
      const err = createHttpError(400, "User already exists with this email");
      throw err;
    }
    return await user.save();
  }
}

export default UserService;
